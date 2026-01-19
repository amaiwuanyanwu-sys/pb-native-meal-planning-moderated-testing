import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { RecipeCard } from '@/components/meal-plan/RecipeCard';
import { Search } from '@/components/ui/Search';
import { RailToggle } from '@/components/ui/RailToggle';
import { RecipeDetailsPopover } from '@/components/nutrition-plans/RecipeDetailsPopover';
import { mockRecipes } from '@/data/mockRecipes';
import type { NutritionPlan } from '@/data/mockNutritionPlans';

interface RightSideRailProps {
  className?: string;
  defaultCollapsed?: boolean;
  defaultTab?: 'recipes' | 'preferences' | 'assistant';
  plan?: NutritionPlan | null;
}

export const RightSideRail: React.FC<RightSideRailProps> = ({
  className,
  defaultCollapsed = false,
  defaultTab = 'recipes',
  plan
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [activeTab, setActiveTab] = useState<'recipes' | 'preferences' | 'assistant'>(defaultTab);
  const [searchValue, setSearchValue] = useState('');
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
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
            {activeTab === 'recipes' && (
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

                {/* Recipe Cards */}
                {mockRecipes.slice(0, 6).map((recipe) => (
                  <RecipeDetailsPopover
                    key={recipe.id}
                    recipe={recipe}
                    open={selectedRecipeId === recipe.id}
                    onOpenChange={(open) => setSelectedRecipeId(open ? recipe.id : null)}
                  >
                    <div>
                      <RecipeCard
                        title={recipe.title}
                        image={recipe.image}
                        time={recipe.time}
                        ingredients={recipe.ingredients?.length || 0}
                        onClick={() => setSelectedRecipeId(recipe.id)}
                        recipeId={recipe.id}
                        draggable={true}
                      />
                    </div>
                  </RecipeDetailsPopover>
                ))}
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="flex flex-col w-full">
                {/* General Section */}
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
                {/* Composer */}
                <button className="bg-[#F8F9F9] border border-[#DFE3E4] rounded flex flex-col items-start w-full">
                  <div className="flex items-start p-4 h-20 w-full">
                    <p className="text-sm font-medium text-[#657A7E] leading-[1.4]">
                      What do you need help with?
                    </p>
                  </div>
                  <div className="flex gap-2.5 items-center justify-end px-4 py-3 w-full">
                    <button className="bg-white border border-[#C1C9CB] rounded flex items-center justify-center p-2 w-8 h-8">
                      <span className="material-icons text-xl text-[#C1C9CB]">arrow_upward</span>
                    </button>
                  </div>
                </button>

                {/* Try Section */}
                <p className="text-xs font-semibold text-[#657A7E] leading-[1.5]">Try</p>
                <div className="flex flex-col gap-2 text-xs font-medium text-[#385459] leading-[1.5]">
                  <p>Create a 7 day meal plan with 5 recipes</p>
                  <p>Make a 3 day vegetarian meal</p>
                  <p>Generate a week of high protein meals</p>
                </div>
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
