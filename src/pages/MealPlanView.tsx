import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { LeftSideRail } from '@/components/layout/LeftSideRail';
import { RightSideRail } from '@/components/layout/RightSideRail';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { DayHeader } from '@/components/meal-plan/DayHeader';
import { MealPlannerRecipeCard } from '@/components/meal-plan/MealPlannerRecipeCard';
import { MealRowHeader } from '@/components/meal-plan/MealRowHeader';
import { RecipeDetailsPopover } from '@/components/nutrition-plans/RecipeDetailsPopover';
import { DroppableSlot } from '@/components/meal-plan/DroppableSlot';
import { DroppableRecipeSlot } from '@/components/meal-plan/DroppableRecipeSlot';
import { loadPlans, updatePlan } from '@/data/mockNutritionPlans';
import type { NutritionPlan } from '@/data/mockNutritionPlans';
import { mockUsers } from '@/data/mockUsers';
import { mockRecipes } from '@/data/mockRecipes';

const MealPlanView: React.FC = () => {
  const { planId, mealPlanId } = useParams<{ planId: string; mealPlanId: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<NutritionPlan | null>(null);

  // Load the plan data from localStorage (always reload to ensure we have the latest)
  useEffect(() => {
    const plans = loadPlans();
    const foundPlan = plans.find(p => p.id === planId);
    if (foundPlan) {
      setPlan(foundPlan);
    }
  }, [planId]);

  const handleBack = () => {
    navigate(`/nutrition/plans/${planId}`);
  };

  // View mode state (grid or kanban)
  const [viewMode, setViewMode] = useState<'grid' | 'kanban'>('grid');

  // Meal plan title state
  const [mealPlanTitle, setMealPlanTitle] = useState(
    mealPlanId ? mealPlanId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Week 1'
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // Tab and nutrient breakdown state
  const [activeSubTab, setActiveSubTab] = useState<'plan' | 'grocery-list'>('plan');
  const [showNutrientBreakdown, setShowNutrientBreakdown] = useState(false);

  // Recipe popover state
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);

  // Handler for dropping a recipe into a meal slot
  const handleRecipeDrop = (day: number, mealTime: string, recipeId: number, sourceDay?: number, sourceMealTime?: string) => {
    if (!plan) return;

    const updatedPlan = { ...plan };

    // Initialize meals array if it doesn't exist
    if (!updatedPlan.mealPlan.meals) {
      updatedPlan.mealPlan.meals = [];
    }

    // If sourceDay and sourceMealTime are provided, this is a move/swap operation
    if (sourceDay !== undefined && sourceMealTime) {
      // Find the source and target meals
      const sourceMealIndex = updatedPlan.mealPlan.meals.findIndex(
        m => m.day === sourceDay && m.mealTime === sourceMealTime
      );
      const targetMealIndex = updatedPlan.mealPlan.meals.findIndex(
        m => m.day === day && m.mealTime === mealTime
      );

      if (sourceMealIndex >= 0) {
        const sourceMeal = updatedPlan.mealPlan.meals[sourceMealIndex];

        if (targetMealIndex >= 0) {
          // Swap: both slots have recipes
          const targetMeal = updatedPlan.mealPlan.meals[targetMealIndex];
          updatedPlan.mealPlan.meals[sourceMealIndex] = {
            ...sourceMeal,
            recipeId: targetMeal.recipeId
          };
          updatedPlan.mealPlan.meals[targetMealIndex] = {
            ...targetMeal,
            recipeId: sourceMeal.recipeId
          };
        } else {
          // Move: target slot is empty
          updatedPlan.mealPlan.meals[sourceMealIndex] = {
            ...sourceMeal,
            recipeId: null
          };
          updatedPlan.mealPlan.meals.push({
            day,
            mealTime: mealTime as 'breakfast' | 'snack' | 'lunch' | 'dinner',
            recipeId
          });
        }
      }
    } else {
      // This is adding a new recipe from the recipe list
      const existingMealIndex = updatedPlan.mealPlan.meals.findIndex(
        m => m.day === day && m.mealTime === mealTime
      );

      if (existingMealIndex >= 0) {
        // Slot already has a recipe - add as side if there's no side yet
        const existingMeal = updatedPlan.mealPlan.meals[existingMealIndex];
        if (!existingMeal.sideRecipeId) {
          // Add as side recipe
          updatedPlan.mealPlan.meals[existingMealIndex] = {
            ...existingMeal,
            sideRecipeId: recipeId
          };
        } else {
          // Already has a side, replace the main recipe
          updatedPlan.mealPlan.meals[existingMealIndex] = {
            ...existingMeal,
            recipeId
          };
        }
      } else {
        // Add new meal
        updatedPlan.mealPlan.meals.push({
          day,
          mealTime: mealTime as 'breakfast' | 'snack' | 'lunch' | 'dinner',
          recipeId
        });
      }
    }

    // Update state
    setPlan(updatedPlan);

    // Persist to localStorage
    updatePlan(updatedPlan);
  };

  // Helper function to get meal for a specific day and meal time
  const getMeal = (day: number, mealTime: 'breakfast' | 'snack' | 'lunch' | 'dinner') => {
    if (!plan?.mealPlan.meals) return null;
    return plan.mealPlan.meals.find(m => m.day === day && m.mealTime === mealTime);
  };

  // Helper function to get recipe by ID
  const getRecipe = (recipeId: number | null) => {
    if (!recipeId) return null;
    return mockRecipes.find(r => r.id === recipeId);
  };

  // Helper function to calculate nutrition totals for a specific day
  const getDayNutrition = (day: number) => {
    if (!plan?.mealPlan.meals) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    }

    const dayMeals = plan.mealPlan.meals.filter(m => m.day === day);
    let totals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

    dayMeals.forEach(meal => {
      const recipe = getRecipe(meal.recipeId);
      if (recipe?.nutrition) {
        totals.calories += recipe.nutrition.calories || 0;
        totals.protein += recipe.nutrition.protein || 0;
        totals.carbs += recipe.nutrition.carbs || 0;
        totals.fat += recipe.nutrition.fat || 0;
        totals.fiber += recipe.nutrition.fiber || 0;
      }
    });

    return totals;
  };

  // Get nutrition targets from plan
  const nutritionTargets = {
    calories: plan?.mealPlan.nutritionTargets?.calories || 2000,
    protein: plan?.mealPlan.nutritionTargets?.protein || 150,
    carbs: plan?.mealPlan.nutritionTargets?.carbs || 250,
    fat: plan?.mealPlan.nutritionTargets?.fat || 67,
    fiber: plan?.mealPlan.nutritionTargets?.fiber || 30,
  };

  // Determine plan title based on plan type
  const planTitle = plan?.type === 'client'
    ? (() => {
        const user = mockUsers.find(u => u.id === plan.clientId);
        return user ? `${user.name}'s Nutrition Plan` : 'Nutrition Plan';
      })()
    : (plan?.templateName || 'Nutrition Plan');

  // Recent items for the left sidebar
  const user = plan?.type === 'client' ? mockUsers.find(u => u.id === plan.clientId) : undefined;

  const recentItems = [
    {
      id: planId || '1',
      label: planTitle,
      path: `/nutrition/plans/${planId}`,
      type: plan?.type || ('client' as const),
      ...(plan?.type === 'client' && user ? {
        avatarInitials: user.initials,
        avatarBgColor: user.avatarColor,
      } : {}),
      ...(plan?.type === 'template' ? {
        templateIconBgColor: '#CFF6DC',
        templateIconColor: '#007820',
      } : {}),
    }
  ];

  const handleRecentItemClick = (item: { id: string; label: string; path: string }) => {
    navigate(item.path);
  };

  return (
    <div className="flex h-screen bg-[#F0F2F3]">
      {/* Sidebar */}
      <Sidebar />

      {/* Left Side Rail */}
      <LeftSideRail
        recentItems={recentItems}
        onRecentItemClick={handleRecentItemClick}
        defaultCollapsed={true}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Control Panel */}
        <div className="flex items-center gap-3 px-2 h-10">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 px-4 py-2.5 rounded hover:bg-[#F0F2F3] transition-colors"
          >
            <span className="material-icons text-xl text-[#385459]">arrow_back</span>
            <span className="text-sm font-semibold text-[#385459] leading-[1.4]">
              Back to nutrition plan
            </span>
          </button>
        </div>

        {/* Second Control Panel - Title and Actions */}
        <div className="flex items-center gap-3 px-6 py-2 h-[58px]">
          {/* Left: Week Title - Editable Input */}
          <div className="flex items-center relative">
            <input
              type="text"
              value={mealPlanTitle}
              onChange={(e) => setMealPlanTitle(e.target.value)}
              onFocus={() => setIsEditingTitle(true)}
              onBlur={() => setIsEditingTitle(false)}
              className="bg-white border border-[#C1C9CB] rounded px-6 py-2 text-xl font-medium text-[#01272E] leading-[1.3] hover:border-[#34B9E0] focus:outline-none focus:border-[#0C7791] focus:ring-2 focus:ring-[#0C7791] focus:ring-opacity-20 transition-all"
              style={{
                width: isEditingTitle ? '300px' : 'auto',
                minWidth: isEditingTitle ? '300px' : 'fit-content'
              }}
              size={isEditingTitle ? 30 : mealPlanTitle.length || 1}
            />
          </div>

          {/* Left/Right Navigation Arrows */}
          <IconButton
            variant="ghost"
            size="md"
            icon={<span className="material-icons text-2xl text-[#385459]">keyboard_arrow_left</span>}
            tooltip="Previous week"
            tooltipPosition="bottom"
            className="focus:ring-0 focus:ring-offset-0"
          />
          <IconButton
            variant="ghost"
            size="md"
            icon={<span className="material-icons text-2xl text-[#385459]">keyboard_arrow_right</span>}
            tooltip="Next week"
            tooltipPosition="bottom"
            className="focus:ring-0 focus:ring-offset-0"
          />

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            {/* Clear Button */}
            <Button variant="ghost" size="md">
              Clear
            </Button>

            {/* Undo/Redo Group */}
            <div className="flex items-center gap-0">
              <IconButton
                variant="secondary"
                size="md"
                icon={<span className="material-icons text-2xl text-[#385459]">undo</span>}
                tooltip="Undo"
                tooltipPosition="bottom"
                className="rounded-r-none border-r-0 focus:ring-0 focus:ring-offset-0"
              />
              <IconButton
                variant="secondary"
                size="md"
                icon={<span className="material-icons text-2xl text-[#385459]">redo</span>}
                tooltip="Redo"
                tooltipPosition="bottom"
                className="rounded-l-none focus:ring-0 focus:ring-offset-0"
              />
            </div>

            {/* Grid/Kanban Toggle */}
            <div className="flex items-center gap-0">
              <IconButton
                variant={viewMode === 'grid' ? 'primary' : 'secondary'}
                size="md"
                icon={<span className="material-icons text-2xl">grid_view</span>}
                tooltip="Grid view"
                tooltipPosition="bottom"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none border-r-0 focus:ring-0 focus:ring-offset-0"
              />
              <IconButton
                variant={viewMode === 'kanban' ? 'primary' : 'secondary'}
                size="md"
                icon={<span className="material-icons text-2xl">view_kanban</span>}
                tooltip="Kanban view"
                tooltipPosition="bottom"
                onClick={() => setViewMode('kanban')}
                className="rounded-l-none focus:ring-0 focus:ring-offset-0"
              />
            </div>

            {/* Print Button */}
            <IconButton
              variant="secondary"
              size="md"
              icon={<span className="material-icons text-2xl text-[#385459]">print</span>}
              tooltip="Print"
              tooltipPosition="bottom"
              className="focus:ring-0 focus:ring-offset-0"
            />

            {/* Publish Button */}
            <Button variant="primary" size="md">
              Publish
            </Button>
          </div>
        </div>

        {/* Tabs and Nutrient Breakdown Section */}
        <div className="flex items-center border-b border-[#DFE3E4] justify-between px-6">
          {/* Tab Bar */}
          <div className="flex h-full items-center">
            <button
              onClick={() => setActiveSubTab('plan')}
              className={`flex items-center justify-center px-4 py-3 h-full ${
                activeSubTab === 'plan'
                  ? 'border-b-2 border-[#01272E]'
                  : ''
              }`}
            >
              <span className={`text-sm font-semibold leading-[1.4] ${
                activeSubTab === 'plan' ? 'text-[#244348]' : 'text-[#657A7E]'
              }`}>
                Plan
              </span>
            </button>
            <button
              onClick={() => setActiveSubTab('grocery-list')}
              className={`flex items-center justify-center px-4 py-3 h-full ${
                activeSubTab === 'grocery-list'
                  ? 'border-b-2 border-[#01272E]'
                  : ''
              }`}
            >
              <span className={`text-sm font-semibold leading-[1.4] ${
                activeSubTab === 'grocery-list' ? 'text-[#244348]' : 'text-[#657A7E]'
              }`}>
                Grocery List
              </span>
            </button>
          </div>

          {/* Show Nutrient Breakdown Checkbox */}
          <button
            onClick={() => setShowNutrientBreakdown(!showNutrientBreakdown)}
            className="flex items-center gap-1 rounded"
          >
            <div className="flex items-center justify-center p-2 w-10 h-10">
              <span className={`material-icons text-xl ${
                showNutrientBreakdown ? 'text-[#007CB2]' : 'text-[#96A5A8]'
              }`}>
                {showNutrientBreakdown ? 'check_box' : 'check_box_outline_blank'}
              </span>
            </div>
            <span className={`text-sm font-semibold leading-[1.4] ${
              showNutrientBreakdown ? 'text-[#007CB2]' : 'text-[#657A7E]'
            }`}>
              Show nutrient breakdown
            </span>
          </button>
        </div>

        <main className="flex-1 overflow-x-auto overflow-y-auto">
          {/* Meal Plan Grid - Using CSS Grid for consistent column widths */}
          <div className="grid grid-cols-[140px_repeat(5,180px)_120px] min-w-min">
            {/* Header Row - Row header column */}
            <div className="bg-[#F8F9F9] border-r border-b border-[#C1C9CB] h-full p-3"></div>
            {/* Day Headers */}
            {[1, 2, 3, 4, 5].map((day) => {
              const nutrition = getDayNutrition(day);
              return (
                <DayHeader
                  key={`day-${day}`}
                  day={`Day ${day}`}
                  totalCalories={nutrition.calories}
                  targetCalories={nutritionTargets.calories}
                  compact={!showNutrientBreakdown}
                  nutrients={showNutrientBreakdown ? [
                    {
                      label: 'Carbs',
                      value: `${nutrition.carbs}g / ${nutritionTargets.carbs}g`,
                      color: '#219EC4'
                    },
                    {
                      label: 'Protein',
                      value: `${nutrition.protein}g / ${nutritionTargets.protein}g`,
                      color: '#FFA081'
                    },
                    {
                      label: 'Fats',
                      value: `${nutrition.fat}g / ${nutritionTargets.fat}g`,
                      color: '#5FE089'
                    },
                    {
                      label: 'Fiber',
                      value: `${nutrition.fiber}g / ${nutritionTargets.fiber}g`,
                      color: '#96A5A8'
                    },
                    {
                      label: 'Sugars',
                      value: '0g / 0g',
                      color: '#96A5A8'
                    },
                  ] : []}
                  className="w-full"
                />
              );
            })}

            {/* Add Day Column Header */}
            <div className="border-b border-[#C1C9CB] flex items-center justify-center px-3 py-1">
              <button className="flex items-center gap-1 h-8 py-2.5 rounded hover:bg-[#F0F2F3] transition-colors">
                <span className="material-icons text-xl text-[#385459]">add</span>
                <span className="text-sm font-semibold text-[#385459] leading-[1.4]">Add day</span>
              </button>
            </div>

            {/* Breakfast Row */}
            <MealRowHeader label="Breakfast" icon="coffee"  />
            {[1, 2, 3, 4, 5].map((day) => {
              const meal = getMeal(day, 'breakfast');
              const recipe = meal ? getRecipe(meal.recipeId) : null;
              const sideRecipe = meal?.sideRecipeId ? getRecipe(meal.sideRecipeId) : null;

              return recipe ? (
                <DroppableRecipeSlot
                  key={`breakfast-${day}`}
                  day={day}
                  mealTime="breakfast"
                  onDrop={handleRecipeDrop}
                >
                  <RecipeDetailsPopover
                    recipe={recipe}
                    open={selectedRecipeId === recipe.id}
                    onOpenChange={(open) => {
                      if (!open) setSelectedRecipeId(null);
                    }}
                  >
                    <div>
                      <MealPlannerRecipeCard
                        title={recipe.title}
                        images={[recipe.image, sideRecipe?.image].filter((img): img is string => !!img)}
                        calories={recipe.nutrition?.calories}
                        protein={recipe.nutrition?.protein}
                        onMainClick={() => setSelectedRecipeId(recipe.id)}
                        onSideClick={sideRecipe ? () => setSelectedRecipeId(sideRecipe.id) : undefined}
                        recipeId={recipe.id}
                        day={day}
                        mealTime="breakfast"
                        draggable={true}
                      />
                    </div>
                  </RecipeDetailsPopover>
                </DroppableRecipeSlot>
              ) : (
                <DroppableSlot
                  key={`breakfast-${day}`}
                  day={day}
                  mealTime="breakfast"
                  onDrop={handleRecipeDrop}
                />
              );
            })}
            <div className="border-b border-[#DFE3E4]"></div>

            {/* Snack Row */}
            <MealRowHeader label="Snack" icon="fastfood" />
            {[1, 2, 3, 4, 5].map((day) => {
              const meal = getMeal(day, 'snack');
              const recipe = meal ? getRecipe(meal.recipeId) : null;
              const sideRecipe = meal?.sideRecipeId ? getRecipe(meal.sideRecipeId) : null;

              return recipe ? (
                <DroppableRecipeSlot
                  key={`snack-${day}`}
                  day={day}
                  mealTime="snack"
                  onDrop={handleRecipeDrop}
                >
                  <RecipeDetailsPopover
                    recipe={recipe}
                    open={selectedRecipeId === recipe.id}
                    onOpenChange={(open) => {
                      if (!open) setSelectedRecipeId(null);
                    }}
                  >
                    <div>
                      <MealPlannerRecipeCard
                        title={recipe.title}
                        images={[recipe.image, sideRecipe?.image].filter((img): img is string => !!img)}
                        calories={recipe.nutrition?.calories}
                        protein={recipe.nutrition?.protein}
                        onMainClick={() => setSelectedRecipeId(recipe.id)}
                        onSideClick={sideRecipe ? () => setSelectedRecipeId(sideRecipe.id) : undefined}
                        recipeId={recipe.id}
                        day={day}
                        mealTime="snack"
                        draggable={true}
                      />
                    </div>
                  </RecipeDetailsPopover>
                </DroppableRecipeSlot>
              ) : (
                <DroppableSlot
                  key={`snack-${day}`}
                  day={day}
                  mealTime="snack"
                  onDrop={handleRecipeDrop}
                />
              );
            })}
            <div className="border-b border-[#DFE3E4]"></div>

            {/* Lunch Row */}
            <MealRowHeader label="Lunch" icon="restaurant" />
            {[1, 2, 3, 4, 5].map((day) => {
              const meal = getMeal(day, 'lunch');
              const recipe = meal ? getRecipe(meal.recipeId) : null;
              const sideRecipe = meal?.sideRecipeId ? getRecipe(meal.sideRecipeId) : null;

              return recipe ? (
                <DroppableRecipeSlot
                  key={`lunch-${day}`}
                  day={day}
                  mealTime="lunch"
                  onDrop={handleRecipeDrop}
                >
                  <RecipeDetailsPopover
                    recipe={recipe}
                    open={selectedRecipeId === recipe.id}
                    onOpenChange={(open) => {
                      if (!open) setSelectedRecipeId(null);
                    }}
                  >
                    <div>
                      <MealPlannerRecipeCard
                        title={recipe.title}
                        images={[recipe.image, sideRecipe?.image].filter((img): img is string => !!img)}
                        calories={recipe.nutrition?.calories}
                        protein={recipe.nutrition?.protein}
                        onMainClick={() => setSelectedRecipeId(recipe.id)}
                        onSideClick={sideRecipe ? () => setSelectedRecipeId(sideRecipe.id) : undefined}
                        recipeId={recipe.id}
                        day={day}
                        mealTime="lunch"
                        draggable={true}
                      />
                    </div>
                  </RecipeDetailsPopover>
                </DroppableRecipeSlot>
              ) : (
                <DroppableSlot
                  key={`lunch-${day}`}
                  day={day}
                  mealTime="lunch"
                  onDrop={handleRecipeDrop}
                />
              );
            })}
            <div className="border-b border-[#DFE3E4]"></div>

            {/* Dinner Row */}
            <MealRowHeader label="Dinner" icon="bedtime" />
            {[1, 2, 3, 4, 5].map((day) => {
              const meal = getMeal(day, 'dinner');
              const recipe = meal ? getRecipe(meal.recipeId) : null;
              const sideRecipe = meal?.sideRecipeId ? getRecipe(meal.sideRecipeId) : null;

              return recipe ? (
                <DroppableRecipeSlot
                  key={`dinner-${day}`}
                  day={day}
                  mealTime="dinner"
                  onDrop={handleRecipeDrop}
                >
                  <RecipeDetailsPopover
                    recipe={recipe}
                    open={selectedRecipeId === recipe.id}
                    onOpenChange={(open) => {
                      if (!open) setSelectedRecipeId(null);
                    }}
                  >
                    <div>
                      <MealPlannerRecipeCard
                        title={recipe.title}
                        images={[recipe.image, sideRecipe?.image].filter((img): img is string => !!img)}
                        calories={recipe.nutrition?.calories}
                        protein={recipe.nutrition?.protein}
                        onMainClick={() => setSelectedRecipeId(recipe.id)}
                        onSideClick={sideRecipe ? () => setSelectedRecipeId(sideRecipe.id) : undefined}
                        recipeId={recipe.id}
                        day={day}
                        mealTime="dinner"
                        draggable={true}
                      />
                    </div>
                  </RecipeDetailsPopover>
                </DroppableRecipeSlot>
              ) : (
                <DroppableSlot
                  key={`dinner-${day}`}
                  day={day}
                  mealTime="dinner"
                  onDrop={handleRecipeDrop}
                />
              );
            })}
            <div className="border-b border-[#DFE3E4]"></div>

            {/* Add Meal Row - spanning all columns */}
            <div className="col-span-7 flex items-center h-14.75 px-2 py-1">
              <button className="flex items-center gap-1 h-8 px-2 py-2.5 rounded hover:bg-[#F0F2F3] transition-colors">
                <span className="material-icons text-xl text-[#385459]">add</span>
                <span className="text-sm font-semibold text-[#385459] leading-[1.4]">Add meal</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Right Side Rail */}
      <RightSideRail defaultTab="recipes" plan={plan} />
    </div>
  );
};

export default MealPlanView;
