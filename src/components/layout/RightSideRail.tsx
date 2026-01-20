import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { RecipeCard } from '@/components/meal-plan/RecipeCard';
import { Search } from '@/components/ui/Search';
import { RailToggle } from '@/components/ui/RailToggle';
import { IconButton } from '@/components/ui/IconButton';
import { RecipeDetailsPopover } from '@/components/nutrition-plans/RecipeDetailsPopover';
import { mockRecipes } from '@/data/mockRecipes';
import type { NutritionPlan } from '@/data/mockNutritionPlans';
import { useAssistant } from '@/hooks/useAssistant';

interface RightSideRailProps {
  className?: string;
  defaultCollapsed?: boolean;
  defaultTab?: 'recipes' | 'preferences' | 'assistant';
  plan?: NutritionPlan | null;
  leftovers?: Map<number, { portions: number; serving: number }>;
  onPreviewMealPlan?: (meals: Array<{ day: number; mealTime: string; recipeId: number }>) => void;
  onApplyMealPlan?: (meals: Array<{ day: number; mealTime: string; recipeId: number }>) => void;
  onDiscardPreview?: () => void;
  hideRecipesTab?: boolean;
  hideGeneralSection?: boolean;
}

export const RightSideRail: React.FC<RightSideRailProps> = ({
  className,
  defaultCollapsed = false,
  defaultTab = 'recipes',
  plan,
  leftovers = new Map(),
  onPreviewMealPlan,
  onApplyMealPlan,
  onDiscardPreview,
  hideRecipesTab = false,
  hideGeneralSection = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [activeTab, setActiveTab] = useState<'recipes' | 'preferences' | 'assistant'>(defaultTab);
  const [searchValue, setSearchValue] = useState('');
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recipeCardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const { userPrompt, response, responseType, suggestedMeals, isLoading, error, send, reset } = useAssistant({
    plan: plan || null,
    availableRecipes: mockRecipes,
  });

  // Calculate which recipes are used in the meal plan and how many times
  const recipeUsageCount = React.useMemo(() => {
    const counts: Record<number, number> = {};
    if (plan?.mealPlan.meals) {
      plan.mealPlan.meals.forEach(meal => {
        if (meal.recipeId) {
          counts[meal.recipeId] = (counts[meal.recipeId] || 0) + 1;
        }
        if (meal.sideRecipeId) {
          counts[meal.sideRecipeId] = (counts[meal.sideRecipeId] || 0) + 1;
        }
      });
    }
    return counts;
  }, [plan]);

  // Match suggested meals with actual recipes
  const matchedMeals = suggestedMeals?.map(meal => {
    const recipe = mockRecipes.find(r =>
      r.title.toLowerCase().includes(meal.recipeTitle.toLowerCase()) ||
      meal.recipeTitle.toLowerCase().includes(r.title.toLowerCase())
    );
    return {
      ...meal,
      recipeId: recipe?.id || null,
      recipe: recipe || null,
    };
  });

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() && !isLoading) {
      send(inputValue);
      setInputValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleExampleClick = (prompt: string) => {
    setInputValue(prompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  // Trigger preview when task response received
  useEffect(() => {
    if (matchedMeals && matchedMeals.length > 0 && responseType === 'task' && onPreviewMealPlan) {
      const mealsToPreview = matchedMeals
        .filter(m => m.recipe)
        .map(m => ({
          day: m.day,
          mealTime: m.mealTime,
          recipeId: m.recipeId!,
        }));
      onPreviewMealPlan(mealsToPreview);
    }
  }, [matchedMeals, responseType, onPreviewMealPlan]);

  const handleAccept = () => {
    console.log('✅ Accept clicked');
    // Apply meals to planner when user accepts
    if (matchedMeals && matchedMeals.length > 0 && onApplyMealPlan) {
      const mealsToApply = matchedMeals
        .filter(m => m.recipe)
        .map(m => ({
          day: m.day,
          mealTime: m.mealTime,
          recipeId: m.recipeId!,
        }));
      console.log('Applying meals:', mealsToApply);
      onApplyMealPlan(mealsToApply);
    }
    console.log('Resetting assistant state');
    reset();
  };

  const handleDiscard = () => {
    console.log('❌ Discard clicked');
    if (onDiscardPreview) {
      console.log('Calling onDiscardPreview');
      onDiscardPreview();
    }
    console.log('Resetting assistant state');
    reset();
  };

  const handleAskAnother = () => {
    reset();
  };

  return (
    <aside className={cn(
      'bg-white flex flex-col h-screen transition-all duration-300 border-l border-[#dfe3e4]',
      'shadow-[-2px_0px_4px_0px_rgba(1,39,46,0.1)]',
      isCollapsed ? 'w-14' : 'w-80',
      className
    )}>
      {/* Toggle Button */}
      <RailToggle
        isCollapsed={isCollapsed}
        onToggle={handleToggleCollapse}
        position="right"
      />

      {!isCollapsed && (
        <>
          {/* Tabs */}
          <div className="border-b border-[#C1C9CB] flex items-center w-full">
            {!hideRecipesTab && (
              <button
                onClick={() => setActiveTab('recipes')}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center px-4 py-0 h-11 min-w-[80px]',
                  'relative'
                )}
              >
                <span className={cn(
                  'text-sm font-semibold leading-[1.4]',
                  activeTab === 'recipes' ? 'text-[#385459]' : 'text-[#657A7E]'
                )}>
                  Recipes
                </span>
                {activeTab === 'recipes' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#01272E]" />
                )}
              </button>
            )}
            <button
              onClick={() => setActiveTab('preferences')}
              className={cn(
                'flex-1 flex flex-col items-center justify-center px-4 py-0 h-11 min-w-[80px]',
                'relative'
              )}
            >
              <span className={cn(
                'text-sm font-semibold leading-[1.4]',
                activeTab === 'preferences' ? 'text-[#385459]' : 'text-[#657A7E]'
              )}>
                Preferences
              </span>
              {activeTab === 'preferences' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#01272E]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('assistant')}
              className={cn(
                'flex-1 flex flex-col items-center justify-center px-4 py-0 h-11 min-w-[80px]',
                'relative'
              )}
            >
              <span className={cn(
                'text-sm font-semibold leading-[1.4]',
                activeTab === 'assistant' ? 'text-[#385459]' : 'text-[#657A7E]'
              )}>
                Assistant
              </span>
              {activeTab === 'assistant' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#01272E]" />
              )}
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {!hideRecipesTab && activeTab === 'recipes' && (
              <div className="flex flex-col gap-3 px-4 py-3">
                {/* Search and Filter */}
                <div className="flex gap-3 items-start w-full">
                  {/* Search Field */}
                  <Search
                    placeholder="Search"
                    value={searchValue}
                    onChange={setSearchValue}
                    variant="stretch"
                  />
                  {/* Filter Button */}
                  <button className="bg-white border border-[#96A5A8] rounded flex items-center justify-center w-10 h-10 p-2">
                    <span className="material-icons text-xl text-[#657A7E]">filter_list</span>
                  </button>
                </div>

                {/* Leftovers Section */}
                {leftovers.size > 0 && (
                  <>
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-xs font-semibold text-[#657A7E] leading-[1.5] uppercase">Leftovers</span>
                      <div className="flex-1 h-px bg-[#DFE3E4]" />
                    </div>
                    {Array.from(leftovers.entries()).map(([recipeId, data]) => {
                      const recipe = mockRecipes.find(r => r.id === recipeId);
                      if (!recipe) return null;
                      return (
                        <div
                          key={`leftover-${recipeId}`}
                          ref={(el) => {
                            if (el) {
                              recipeCardRefs.current.set(recipeId, el);
                            }
                          }}
                        >
                          <RecipeCard
                            title={recipe.title}
                            image={recipe.image}
                            time={recipe.time}
                            ingredients={recipe.ingredients || 0}
                            onClick={() => setSelectedRecipeId(recipe.id)}
                            recipeId={recipeId}
                            draggable={true}
                            isLeftover={true}
                            leftoverPortions={data.portions}
                          />
                        </div>
                      );
                    })}
                  </>
                )}

                {/* Recipe Cards */}
                {mockRecipes.map((recipe) => {
                  const usageCount = recipeUsageCount[recipe.id] || 0;
                  return (
                    <div
                      key={recipe.id}
                      ref={(el) => {
                        if (el) {
                          recipeCardRefs.current.set(recipe.id, el);
                        } else {
                          recipeCardRefs.current.delete(recipe.id);
                        }
                      }}
                    >
                      <RecipeCard
                        title={recipe.title}
                        image={recipe.image}
                        time={recipe.time}
                        ingredients={recipe.ingredients || 0}
                        onClick={() => setSelectedRecipeId(recipe.id)}
                        recipeId={recipe.id}
                        draggable={true}
                        usageCount={usageCount}
                      />
                    </div>
                  );
                })}

                {/* Popover rendered separately */}
                {selectedRecipeId && (
                  <RecipeDetailsPopover
                    recipe={mockRecipes.find(r => r.id === selectedRecipeId)!}
                    open={true}
                    onOpenChange={(open) => {
                      if (!open) {
                        setSelectedRecipeId(null);
                      }
                    }}
                    anchorElement={recipeCardRefs.current.get(selectedRecipeId) || null}
                  />
                )}
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="flex flex-col w-full">
                {/* General Section */}
                {!hideGeneralSection && (
                  <div className="flex flex-col w-full">
                    <div className="bg-white flex h-10 items-center justify-between pl-4 pr-0">
                      <div className="flex gap-2 items-center">
                        <span className="material-icons text-xl text-[#657A7E]">info</span>
                        <span className="text-sm font-semibold text-[#385459] leading-[1.4]">General</span>
                      </div>
                      <button className="flex items-center justify-center p-2 w-10 rounded hover:bg-[#F0F2F3]">
                        <span className="material-icons text-xl text-[#657A7E]">keyboard_arrow_up</span>
                      </button>
                    </div>
                    <div className="border-b border-[#DFE3E4] flex flex-col gap-0 px-4 pb-3">
                      <div className="flex flex-col gap-1 pt-1.5 w-full relative">
                        <div className="relative">
                          <input
                            type="text"
                            value={plan?.templateName || '7-Day PCOS Balance Plan'}
                            readOnly
                            className="bg-white border border-[#C1C9CB] rounded h-10 w-full px-3 text-sm font-medium text-[#244348]"
                          />
                          <div className="absolute left-0 px-2 -top-2 h-3 flex items-center pointer-events-none z-20">
                            <div className="bg-white px-1 h-3 flex items-center">
                              <p className="text-xs font-semibold text-[#385459] leading-none">
                                Plan name *
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Nutrition Section */}
                <div className="border-b border-[#DFE3E4] flex flex-col overflow-hidden w-full">
                  <div className="bg-white flex h-10 items-center justify-between pl-4 pr-0">
                    <div className="flex gap-2 items-center">
                      <span className="material-icons text-xl text-[#657A7E]">adjust</span>
                      <span className="text-sm font-semibold text-[#385459] leading-[1.4]">Nutrition</span>
                    </div>
                    <div className="flex items-center justify-end">
                      <span className="bg-[#F2F8FB] border border-[#007CB2] rounded-full px-2 py-0.5 text-xs font-medium text-[#007CB2] leading-[1.5]">
                        5 targets
                      </span>
                      <button className="flex items-center justify-center p-2 w-10 rounded hover:bg-[#F0F2F3]">
                        <span className="material-icons text-xl text-[#657A7E]">keyboard_arrow_up</span>
                      </button>
                    </div>
                  </div>

                  {/* Nutrition Targets Fields */}
                  <div className="flex flex-col px-4 pt-2 pb-3 gap-3">
                    {/* Row 1: Calories and Protein */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1 pt-1.5 relative">
                        <div className="relative">
                          <input
                            type="text"
                            value={plan?.mealPlan.nutritionTargets?.calories?.toLocaleString() || '2,000'}
                            readOnly
                            className="bg-white border border-[#C1C9CB] rounded h-10 w-full px-3 text-sm font-medium text-[#244348]"
                          />
                          <div className="absolute left-0 px-2 -top-2 h-3 flex items-center pointer-events-none z-20">
                            <div className="bg-white px-1 h-3 flex items-center">
                              <p className="text-xs font-semibold text-[#385459] leading-none">
                                Calories (kcal)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 pt-1.5 relative">
                        <div className="relative">
                          <input
                            type="text"
                            value={plan?.mealPlan.nutritionTargets?.protein || '110'}
                            readOnly
                            className="bg-white border border-[#C1C9CB] rounded h-10 w-full px-3 text-sm font-medium text-[#244348]"
                          />
                          <div className="absolute left-0 px-2 -top-2 h-3 flex items-center pointer-events-none z-20">
                            <div className="bg-white px-1 h-3 flex items-center">
                              <p className="text-xs font-semibold text-[#385459] leading-none">
                                Protein (g)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Fat and Fiber */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1 pt-1.5 relative">
                        <div className="relative">
                          <input
                            type="text"
                            value={plan?.mealPlan.nutritionTargets?.fat || '65'}
                            readOnly
                            className="bg-white border border-[#C1C9CB] rounded h-10 w-full px-3 text-sm font-medium text-[#244348]"
                          />
                          <div className="absolute left-0 px-2 -top-2 h-3 flex items-center pointer-events-none z-20">
                            <div className="bg-white px-1 h-3 flex items-center">
                              <p className="text-xs font-semibold text-[#385459] leading-none">
                                Fat (g)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 pt-1.5 relative">
                        <div className="relative">
                          <input
                            type="text"
                            value={plan?.mealPlan.nutritionTargets?.fiber || '30'}
                            readOnly
                            className="bg-white border border-[#C1C9CB] rounded h-10 w-full px-3 text-sm font-medium text-[#244348]"
                          />
                          <div className="absolute left-0 px-2 -top-2 h-3 flex items-center pointer-events-none z-20">
                            <div className="bg-white px-1 h-3 flex items-center">
                              <p className="text-xs font-semibold text-[#385459] leading-none">
                                Fiber (g)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Row 3: Carbs */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1 pt-1.5 relative">
                        <div className="relative">
                          <input
                            type="text"
                            value={plan?.mealPlan.nutritionTargets?.carbs || '120'}
                            readOnly
                            className="bg-white border border-[#C1C9CB] rounded h-10 w-full px-3 text-sm font-medium text-[#244348]"
                          />
                          <div className="absolute left-0 px-2 -top-2 h-3 flex items-center pointer-events-none z-20">
                            <div className="bg-white px-1 h-3 flex items-center">
                              <p className="text-xs font-semibold text-[#385459] leading-none">
                                Carb (g)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Food preferences Section */}
                <div className="border-b border-[#DFE3E4] flex flex-col overflow-hidden w-full">
                  <div className="bg-white flex h-10 items-center justify-between pl-4 pr-0">
                    <div className="flex gap-2 items-center">
                      <span className="material-icons text-xl text-[#657A7E]">restaurant</span>
                      <span className="text-sm font-semibold text-[#385459] leading-[1.4]">Food preferences</span>
                    </div>
                    <div className="flex items-center justify-end">
                      <span className="bg-[#F2F8FB] border border-[#007CB2] rounded-full px-2 py-0.5 text-xs font-medium text-[#007CB2] leading-[1.5]">
                        5 selected
                      </span>
                      <button className="flex items-center justify-center p-2 w-10 rounded hover:bg-[#F0F2F3]">
                        <span className="material-icons text-xl text-[#657A7E]">keyboard_arrow_up</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Exclusions Section */}
                <div className="border-b border-[#DFE3E4] flex flex-col overflow-hidden w-full">
                  <div className="bg-white flex h-10 items-center justify-between pl-4 pr-0">
                    <div className="flex gap-2 items-center">
                      <span className="material-icons text-xl text-[#657A7E]">no_meals</span>
                      <span className="text-sm font-semibold text-[#385459] leading-[1.4]">Exclusions</span>
                    </div>
                    <div className="flex items-center justify-end">
                      <span className="bg-[#F2F8FB] border border-[#007CB2] rounded-full px-2 py-0.5 text-xs font-medium text-[#007CB2] leading-[1.5]">
                        4 selected
                      </span>
                      <button className="flex items-center justify-center p-2 w-10 rounded hover:bg-[#F0F2F3]">
                        <span className="material-icons text-xl text-[#657A7E]">keyboard_arrow_up</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'assistant' && (
              <div className="flex flex-col gap-3 px-4 py-4">
                {/* Empty State - Show composer + Try section */}
                {!userPrompt && !isLoading && (
                  <>
                    {/* Composer */}
                    <div className="bg-[#F8F9F9] border border-[#DFE3E4] rounded flex flex-col items-start w-full">
                      <div className="flex items-start p-4 h-20 w-full">
                        <textarea
                          ref={textareaRef}
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="What do you need help with?"
                          className="bg-transparent w-full text-sm font-medium text-[#244348] placeholder:text-[#657A7E] leading-[1.4] resize-none focus:outline-none"
                          rows={1}
                        />
                      </div>
                      <div className="flex gap-2.5 items-center justify-end px-4 py-3 w-full">
                        <IconButton
                          variant="secondary"
                          size="sm"
                          onClick={handleSendMessage}
                          disabled={!inputValue.trim()}
                          icon={
                            <span className="material-icons text-xl">
                              arrow_upward
                            </span>
                          }
                        />
                      </div>
                    </div>

                    {/* Try Section */}
                    <p className="text-xs font-semibold text-[#657A7E] leading-[1.5]">Try</p>
                    <div className="flex flex-col gap-2 text-xs font-medium text-[#385459] leading-[1.5]">
                      <button onClick={() => handleExampleClick('Create a 7 day meal plan with 5 recipes')} className="text-left">
                        Create a 7 day meal plan with 5 recipes
                      </button>
                      <button onClick={() => handleExampleClick('Make a 3 day vegetarian meal')} className="text-left">
                        Make a 3 day vegetarian meal
                      </button>
                      <button onClick={() => handleExampleClick('Generate a week of high protein meals')} className="text-left">
                        Generate a week of high protein meals
                      </button>
                    </div>
                  </>
                )}

                {/* Loading State - Show user prompt + loading */}
                {isLoading && (
                  <div className="bg-[#F8F9F9] border border-[#DFE3E4] rounded flex flex-col items-start w-full">
                    <div className="flex items-start p-4 w-full">
                      <p className="text-sm font-medium text-[#01272E] leading-[1.4]">
                        {userPrompt}
                      </p>
                    </div>
                    <div className="flex gap-2.5 items-center justify-end px-4 py-3 w-full">
                      <IconButton
                        variant="secondary"
                        size="sm"
                        disabled
                        icon={
                          <span className="material-icons text-xl animate-spin">
                            autorenew
                          </span>
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Task Response - Show prompt + response with Accept/Discard */}
                {!isLoading && response && responseType === 'task' && (
                  <>
                    <div className="bg-[#F8F9F9] rounded flex flex-col items-start w-full">
                      <div className="flex items-start p-4 w-full">
                        <p className="text-sm font-medium text-[#385459] leading-[1.4]">
                          {userPrompt}
                        </p>
                      </div>
                    </div>
                    <div className="bg-[#F2F8FB] border-l-4 border-[#007CB2] rounded flex flex-col gap-3 items-start p-4 w-full">
                      <p className="text-sm font-medium text-[#007CB2] leading-[1.4]">
                        {response}
                      </p>

                      {/* Show suggested meals if available */}
                      {matchedMeals && matchedMeals.length > 0 && (
                        <div className="w-full">
                          <p className="text-xs font-semibold text-[#007CB2] mb-2">Suggested Meals:</p>
                          <div className="flex flex-col gap-1 text-xs text-[#007CB2]">
                            {matchedMeals.map((meal, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <span className="font-medium">Day {meal.day} {meal.mealTime}:</span>
                                <span className={meal.recipe ? '' : 'text-orange-600'}>
                                  {meal.recipe ? meal.recipe.title : `${meal.recipeTitle} (not found)`}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3 items-start w-full">
                        <button
                          onClick={handleDiscard}
                          className="flex-1 flex gap-1 items-center justify-center px-4 py-2.5 rounded"
                        >
                          <span className="material-icons text-xl text-[#385459]">close</span>
                          <span className="text-sm font-semibold text-[#385459]">Discard</span>
                        </button>
                        <button
                          onClick={handleAccept}
                          disabled={matchedMeals && matchedMeals.some(m => !m.recipe)}
                          className={cn(
                            "flex-1 flex gap-1 items-center justify-center px-4 py-2.5 rounded h-10",
                            matchedMeals && matchedMeals.some(m => !m.recipe)
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-[#01272E]"
                          )}
                        >
                          <span className="material-icons text-xl text-white">done</span>
                          <span className="text-sm font-semibold text-white">Accept</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Question Response - Show prompt + answer with Ask Another */}
                {!isLoading && response && responseType === 'question' && (
                  <>
                    <div className="bg-[#F8F9F9] rounded flex flex-col items-start w-full">
                      <div className="flex items-start p-4 w-full">
                        <p className="text-sm font-medium text-[#385459] leading-[1.4]">
                          {userPrompt}
                        </p>
                      </div>
                    </div>
                    <div className="bg-[#F2F8FB] border-l-4 border-[#007CB2] rounded flex flex-col gap-3 items-end p-4 w-full">
                      <p className="text-sm font-medium text-[#007CB2] leading-[1.4] w-full">
                        {response}
                      </p>
                      <button
                        onClick={handleAskAnother}
                        className="flex items-center px-4 py-2.5 rounded"
                      >
                        <span className="text-sm font-semibold text-[#007CB2]">Ask another question</span>
                      </button>
                    </div>
                  </>
                )}

                {/* Error State - Show prompt + error with Ask Another */}
                {!isLoading && error && (
                  <>
                    <div className="bg-[#F8F9F9] rounded flex flex-col items-start w-full">
                      <div className="flex items-start p-4 w-full">
                        <p className="text-sm font-medium text-[#385459] leading-[1.4]">
                          {userPrompt}
                        </p>
                      </div>
                    </div>
                    <div className="bg-[#FFFBEF] border-l-4 border-[#A36624] rounded flex flex-col gap-3 items-start p-4 w-full">
                      <p className="text-sm font-medium text-[#A36624] leading-[1.4]">
                        {error}
                      </p>
                      <div className="flex justify-end w-full">
                        <button
                          onClick={handleAskAnother}
                          className="flex items-center px-4 py-2.5 rounded"
                        >
                          <span className="text-sm font-semibold text-[#A36624]">Ask another question</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {isCollapsed && (
        <div className="flex-1 bg-white flex flex-col items-center w-14">
          <button className="flex items-center justify-center px-6 py-2 w-full">
            <span className="material-icons text-xl text-[#657A7E]">info</span>
          </button>
          <button className="flex items-center justify-center px-6 py-2 w-full">
            <span className="material-icons text-xl text-[#657A7E]">adjust</span>
          </button>
          <button className="flex items-center justify-center px-6 py-2 w-full">
            <span className="material-icons text-xl text-[#657A7E]">restaurant</span>
          </button>
          <button className="flex items-center justify-center px-6 py-2 w-full">
            <span className="material-icons text-xl text-[#657A7E]">no_meals</span>
          </button>
          <div className="h-2 w-9.5 my-1">
            <div className="h-px bg-[#DFE3E4]" />
          </div>
          <button className="flex items-center justify-center px-6 py-2 w-full">
            <span className="material-icons text-xl text-[#657A7E]">auto_awesome</span>
          </button>
        </div>
      )}
    </aside>
  );
};
