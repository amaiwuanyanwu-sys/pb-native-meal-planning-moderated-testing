import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { Sidebar } from '@/components/layout/Sidebar';
import { LeftSideRail } from '@/components/layout/LeftSideRail';
import { ClientLeftRail } from '@/components/clients/ClientLeftRail';
import { RightSideRail } from '@/components/layout/RightSideRail';
import { CellDetailView } from '@/components/meal-plan/CellDetailView';
import { RecipeSelectionView } from '@/components/meal-plan/RecipeSelectionView';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Avatar } from '@/components/ui/Avatar';
import { DayHeader } from '@/components/meal-plan/DayHeader';
import { MealPlannerRecipeCard } from '@/components/meal-plan/MealPlannerRecipeCard';
import { RecipeCard } from '@/components/meal-plan/RecipeCard';
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

  // Plan state management
  const [plan, setPlan] = useState<NutritionPlan | null>(null);

  // Load the plan data from localStorage (always reload to ensure we have the latest)
  useEffect(() => {
    const plans = loadPlans();
    const foundPlan = plans.find(p => p.id === planId);
    if (foundPlan) {
      setPlan(foundPlan);
    }
  }, [planId]);

  // Sync plan changes to localStorage
  useEffect(() => {
    if (plan) {
      updatePlan(plan);
    }
  }, [plan]);

  const handleBack = () => {
    // Close any open views and navigate back to nutrition plan or client detail
    setSelectedCell(null);
    setSelectionMode(null);

    // If this is a client plan, navigate back to client detail
    if (plan?.type === 'client' && plan?.clientId) {
      navigate(`/clients/${plan.clientId}`);
    } else {
      navigate(`/nutrition/plans/${planId}`);
    }
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
  const [popoverAnchorElement, setPopoverAnchorElement] = useState<HTMLElement | null>(null);

  // Selected cell state for detail view
  const [selectedCell, setSelectedCell] = useState<{ day: number; mealTime: 'breakfast' | 'snack' | 'lunch' | 'dinner' } | null>(null);

  // Recipe selection state
  const [selectionMode, setSelectionMode] = useState<{ day: number; mealTime: 'breakfast' | 'snack' | 'lunch' | 'dinner'; type: 'main' | 'side'; isReplacing?: boolean } | null>(null);

  // AI preview state
  const [previewMeals, setPreviewMeals] = useState<Array<{ day: number; mealTime: string; recipeId: number }> | null>(null);
  const [planBeforePreview, setPlanBeforePreview] = useState<NutritionPlan | null>(null);

  // Leftover tracking state
  // Key: recipeId, Value: { portions: remaining portions, serving: serving size }
  const [leftovers, setLeftovers] = useState<Map<number, { portions: number; serving: number }>>(new Map());

  // Drag and drop state
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Drag starts after moving 8px - prevents conflict with clicks
      },
    })
  );

  // Handler for drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // Handler for drag over
  const handleDragOver = (_event: DragOverEvent) => {
    // Track over state if needed for visual feedback
  };

  // Handler for dropping a leftover into a meal slot
  const handleLeftoverDrop = useCallback((day: number, mealTime: string, recipeId: number) => {
    if (!plan) return;

    // Get the leftover data (portions and serving)
    const leftoverData = leftovers.get(recipeId);
    if (!leftoverData) return;

    const serving = leftoverData.serving;

    // Reduce leftover count by 1
    setLeftovers(prev => {
      const newLeftovers = new Map(prev);
      const currentData = newLeftovers.get(recipeId);

      if (!currentData) return newLeftovers;

      if (currentData.portions <= 1) {
        // Remove from leftovers if this is the last portion
        newLeftovers.delete(recipeId);
      } else {
        // Reduce portion count by 1
        newLeftovers.set(recipeId, { portions: currentData.portions - 1, serving: currentData.serving });
      }

      return newLeftovers;
    });

    // Add the recipe to the planner slot with 1 portion and the original serving size
    const updatedPlan = { ...plan };

    if (!updatedPlan.mealPlan.meals) {
      updatedPlan.mealPlan.meals = [];
    }

    const existingMealIndex = updatedPlan.mealPlan.meals.findIndex(
      m => m.day === day && m.mealTime === mealTime
    );

    if (existingMealIndex >= 0) {
      // Slot already has a recipe - add as side if there's no side yet
      const existingMeal = updatedPlan.mealPlan.meals[existingMealIndex];
      if (!existingMeal.sideRecipeId) {
        updatedPlan.mealPlan.meals[existingMealIndex] = {
          ...existingMeal,
          sideRecipeId: recipeId,
          sidePortion: 1,
          sideServing: serving,
          sideIsFromLeftover: true
        };
      } else {
        // Already has a side, replace the main recipe
        updatedPlan.mealPlan.meals[existingMealIndex] = {
          ...existingMeal,
          recipeId,
          mainPortion: 1,
          mainServing: serving,
          mainIsFromLeftover: true
        };
      }
    } else {
      // Add new meal with 1 portion and the original serving size
      updatedPlan.mealPlan.meals.push({
        day,
        mealTime: mealTime as 'breakfast' | 'snack' | 'lunch' | 'dinner',
        recipeId,
        mainPortion: 1,
        mainServing: serving,
        mainIsFromLeftover: true
      });
    }

    setPlan(updatedPlan);
  }, [plan, setPlan, leftovers]);

  // Get the active recipe for drag overlay
  const getActiveRecipe = () => {
    if (!activeId) return null;

    if (activeId.startsWith('recipe-') || activeId.startsWith('leftover-')) {
      const recipeId = parseInt(activeId.replace(/^(recipe|leftover)-/, ''));
      return getRecipe(recipeId);
    } else if (activeId.startsWith('planner-')) {
      const [, day, mealTime] = activeId.split('-');
      const meal = getMeal(parseInt(day), mealTime as 'breakfast' | 'snack' | 'lunch' | 'dinner');
      if (meal?.recipeId) {
        return getRecipe(meal.recipeId);
      }
    }

    return null;
  };

  // Handler for drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    // Block interactions during preview mode
    if (previewMeals) return;

    if (!over || !plan) return;

    // Parse the IDs
    // Format: "planner-{day}-{mealTime}", "recipe-{recipeId}", or "leftover-{recipeId}"
    const activeIdStr = active.id as string;
    const overIdStr = over.id as string;

    // Don't do anything if dropping on the same slot
    if (activeIdStr === overIdStr) return;

    // Determine if we're dragging from planner, recipe list, or leftover
    if (activeIdStr.startsWith('planner-')) {
      // Dragging from planner
      const [, sourceDay, sourceMealTime] = activeIdStr.split('-');
      const sourceMeal = plan.mealPlan.meals?.find(
        m => m.day === parseInt(sourceDay) && m.mealTime === sourceMealTime
      );

      if (!sourceMeal) return;

      if (overIdStr.startsWith('planner-')) {
        // Dropping onto another planner slot
        const [, targetDay, targetMealTime] = overIdStr.split('-');
        if (sourceMeal.recipeId !== null) {
          handleRecipeDrop(
            parseInt(targetDay),
            targetMealTime,
            sourceMeal.recipeId,
            parseInt(sourceDay),
            sourceMealTime
          );
        }
      }
    } else if (activeIdStr.startsWith('recipe-')) {
      // Dragging from recipe list
      const recipeId = parseInt(activeIdStr.replace('recipe-', ''));

      if (overIdStr.startsWith('planner-')) {
        // Dropping onto planner slot
        const [, targetDay, targetMealTime] = overIdStr.split('-');
        handleRecipeDrop(parseInt(targetDay), targetMealTime, recipeId);
      }
    } else if (activeIdStr.startsWith('leftover-')) {
      // Dragging from leftover list
      const recipeId = parseInt(activeIdStr.replace('leftover-', ''));

      if (overIdStr.startsWith('planner-')) {
        // Dropping onto planner slot
        const [, targetDay, targetMealTime] = overIdStr.split('-');
        handleLeftoverDrop(parseInt(targetDay), targetMealTime, recipeId);
      }
    }
  };

  // Handler for clearing all meals
  const handleClearAll = () => {
    if (!plan) return;

    const updatedPlan = {
      ...plan,
      mealPlan: {
        ...plan.mealPlan,
        meals: []
      }
    };

    setPlan(updatedPlan);
  };

  // Handler for dropping a recipe into a meal slot
  const handleRecipeDrop = useCallback((day: number, mealTime: string, recipeId: number, sourceDay?: number, sourceMealTime?: string) => {
    console.log('handleRecipeDrop called:', { day, mealTime, recipeId, sourceDay, sourceMealTime });
    if (!plan) return;

    const updatedPlan = { ...plan };

    // Initialize meals array if it doesn't exist
    if (!updatedPlan.mealPlan.meals) {
      updatedPlan.mealPlan.meals = [];
    }

    // If sourceDay and sourceMealTime are provided, this is a move/swap operation
    if (sourceDay !== undefined && sourceMealTime) {
      console.log('Processing move/swap operation');
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
          // Remove from source by filtering it out
          updatedPlan.mealPlan.meals = updatedPlan.mealPlan.meals.filter(
            (_, index) => index !== sourceMealIndex
          );
          // Add to target - preserve the original meal's portion and serving data
          updatedPlan.mealPlan.meals.push({
            day,
            mealTime: mealTime as 'breakfast' | 'snack' | 'lunch' | 'dinner',
            recipeId,
            mainPortion: sourceMeal.mainPortion || 1,
            mainServing: sourceMeal.mainServing || 1
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
            sideRecipeId: recipeId,
            sidePortion: 1,
            sideServing: 1
          };
        } else {
          // Already has a side, replace the main recipe
          updatedPlan.mealPlan.meals[existingMealIndex] = {
            ...existingMeal,
            recipeId,
            mainPortion: 1,
            mainServing: 1
          };
        }
      } else {
        // Add new meal
        updatedPlan.mealPlan.meals.push({
          day,
          mealTime: mealTime as 'breakfast' | 'snack' | 'lunch' | 'dinner',
          recipeId,
          mainPortion: 1,
          mainServing: 1
        });
      }
    }

    // Update state (will be persisted to localStorage via useEffect)
    setPlan(updatedPlan);
  }, [plan, setPlan]);

  // Helper function to get meal for a specific day and meal time
  const getMeal = (day: number, mealTime: 'breakfast' | 'snack' | 'lunch' | 'dinner') => {
    if (!plan?.mealPlan.meals) return null;
    return plan.mealPlan.meals.find(m => m.day === day && m.mealTime === mealTime);
  };

  // Helper function to check if a meal is in preview
  const isPreviewMeal = (day: number, mealTime: string) => {
    if (!previewMeals) return false;
    return previewMeals.some(m => m.day === day && m.mealTime === mealTime);
  };

  // Helper function to get preview meal
  const getPreviewMeal = (day: number, mealTime: string) => {
    if (!previewMeals) return null;
    return previewMeals.find(m => m.day === day && m.mealTime === mealTime);
  };

  // Helper function to get recipe by ID
  const getRecipe = (recipeId: number | null) => {
    if (!recipeId) return null;
    return mockRecipes.find(r => r.id === recipeId) || null;
  };

  // Helper function to check if a cell is selected (either directly or in selection mode)
  const isCellSelected = (day: number, mealTime: 'breakfast' | 'snack' | 'lunch' | 'dinner') => {
    // Check if cell is directly selected
    if (selectedCell?.day === day && selectedCell?.mealTime === mealTime) {
      return true;
    }
    // Check if cell is being edited in selection mode
    if (selectionMode?.day === day && selectionMode?.mealTime === mealTime) {
      return true;
    }
    return false;
  };

  // Helper function to calculate nutrition totals for a specific day
  const getDayNutrition = (day: number) => {
    if (!plan?.mealPlan.meals) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    }

    const dayMeals = plan.mealPlan.meals.filter(m => m.day === day);
    let totals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

    dayMeals.forEach(meal => {
      // Main recipe
      const recipe = getRecipe(meal.recipeId);
      const mainServing = meal.mainServing || 1;
      if (recipe?.nutrition) {
        totals.calories += (recipe.nutrition.calories || 0) * mainServing;
        totals.protein += (recipe.nutrition.protein || 0) * mainServing;
        totals.carbs += (recipe.nutrition.carbs || 0) * mainServing;
        totals.fat += (recipe.nutrition.fat || 0) * mainServing;
        totals.fiber += (recipe.nutrition.fiber || 0) * mainServing;
      }

      // Side recipe
      if (meal.sideRecipeId) {
        const sideRecipe = getRecipe(meal.sideRecipeId);
        const sideServing = meal.sideServing || 1;
        if (sideRecipe?.nutrition) {
          totals.calories += (sideRecipe.nutrition.calories || 0) * sideServing;
          totals.protein += (sideRecipe.nutrition.protein || 0) * sideServing;
          totals.carbs += (sideRecipe.nutrition.carbs || 0) * sideServing;
          totals.fat += (sideRecipe.nutrition.fat || 0) * sideServing;
          totals.fiber += (sideRecipe.nutrition.fiber || 0) * sideServing;
        }
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

  // Recent items for the left sidebar - load from localStorage
  const recentItems = React.useMemo(() => {
    const plans = loadPlans();

    // Sort by most recently updated and take top 5
    return [...plans]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
      .map(p => {
        const user = mockUsers.find(u => u.id === p.clientId);
        const label = p.type === 'client'
          ? (user ? `${user.name}'s Nutrition Plan` : 'Nutrition Plan')
          : (p.templateName || 'Untitled Template');

        return {
          id: p.id,
          label,
          path: `/nutrition/plans/${p.id}`,
          type: p.type,
          ...(p.type === 'client' && user ? {
            avatarInitials: user.initials,
            avatarBgColor: user.avatarColor,
          } : {}),
          ...(p.type === 'template' ? {
            templateIconBgColor: '#CFF6DC',
            templateIconColor: '#007820',
          } : {}),
        };
      });
  }, [planId]); // Recalculate when planId changes

  const handleRecentItemClick = (item: { id: string; label: string; path: string }) => {
    navigate(item.path);
  };

  // Memoize callbacks to prevent infinite loops
  const handlePreviewMealPlan = useCallback((meals: Array<{ day: number; mealTime: string; recipeId: number }>) => {
    // Save the current plan state before showing preview
    if (plan) {
      setPlanBeforePreview(JSON.parse(JSON.stringify(plan)));
    }
    setPreviewMeals(meals);
  }, [plan]);

  const handleApplyMealPlan = useCallback((meals: Array<{ day: number; mealTime: string; recipeId: number }>) => {
    if (!plan) return;

    const updatedPlan = { ...plan };

    // Initialize meals array if it doesn't exist
    if (!updatedPlan.mealPlan.meals) {
      updatedPlan.mealPlan.meals = [];
    }

    // Apply each meal to the planner
    meals.forEach(meal => {
      const existingMealIndex = updatedPlan.mealPlan.meals!.findIndex(
        m => m.day === meal.day && m.mealTime === meal.mealTime
      );

      if (existingMealIndex >= 0) {
        // Update existing meal
        updatedPlan.mealPlan.meals![existingMealIndex] = {
          ...updatedPlan.mealPlan.meals![existingMealIndex],
          recipeId: meal.recipeId
        };
      } else {
        // Add new meal
        updatedPlan.mealPlan.meals!.push({
          day: meal.day,
          mealTime: meal.mealTime as 'breakfast' | 'snack' | 'lunch' | 'dinner',
          recipeId: meal.recipeId
        });
      }
    });

    // Update the plan state once with all changes
    setPlan(updatedPlan);

    // Clear preview state in next tick to ensure plan update has been processed
    setTimeout(() => {
      setPreviewMeals(null);
      setPlanBeforePreview(null);
    }, 0);
  }, [plan, setPlan]);

  const handleDiscardPreview = useCallback(() => {
    console.log('🗑️ Discard clicked');
    console.log('Plan before preview:', planBeforePreview);
    console.log('Current plan:', plan);
    // Restore the plan to the state before preview
    if (planBeforePreview) {
      console.log('Restoring plan to previous state');
      setPlan(planBeforePreview);
    }
    // Clear preview state in next tick to ensure plan restoration has been processed
    setTimeout(() => {
      setPreviewMeals(null);
      setPlanBeforePreview(null);
    }, 0);
  }, [planBeforePreview, plan, setPlan]);

  // Handler for cell click
  const handleCellClick = (day: number, mealTime: 'breakfast' | 'snack' | 'lunch' | 'dinner') => {
    // Check if cell has a recipe
    const meal = getMeal(day, mealTime);

    if (!meal || !meal.recipeId) {
      // Empty cell - go straight to recipe selection for main
      // Clear any existing selection
      setSelectedCell(null);
      setSelectionMode({ day, mealTime, type: 'main' });
    } else {
      // Cell has a recipe - show cell detail view
      // Clear any existing selection mode
      setSelectionMode(null);
      setSelectedCell({ day, mealTime });
    }
  };

  // Handler for closing cell detail view
  const handleCloseCellDetail = () => {
    setSelectedCell(null);
  };

  // Handler for removing main recipe from a cell
  const handleRemoveMain = useCallback((day: number, mealTime: 'breakfast' | 'snack' | 'lunch' | 'dinner') => {
    if (!plan) return;

    const updatedPlan = { ...plan };
    if (!updatedPlan.mealPlan.meals) {
      updatedPlan.mealPlan.meals = [];
    }

    const mealIndex = updatedPlan.mealPlan.meals.findIndex(
      m => m.day === day && m.mealTime === mealTime
    );

    if (mealIndex >= 0) {
      // Remove the meal entirely
      updatedPlan.mealPlan.meals = updatedPlan.mealPlan.meals.filter((_, index) => index !== mealIndex);
    }

    setPlan(updatedPlan);
  }, [plan, setPlan]);

  // Handler for removing side recipe from a cell
  const handleRemoveSide = useCallback((day: number, mealTime: 'breakfast' | 'snack' | 'lunch' | 'dinner') => {
    if (!plan) return;

    const updatedPlan = { ...plan };
    if (!updatedPlan.mealPlan.meals) {
      updatedPlan.mealPlan.meals = [];
    }

    const mealIndex = updatedPlan.mealPlan.meals.findIndex(
      m => m.day === day && m.mealTime === mealTime
    );

    if (mealIndex >= 0) {
      const meal = updatedPlan.mealPlan.meals[mealIndex];
      if (meal.sideRecipeId) {
        // Remove only the side recipe
        updatedPlan.mealPlan.meals[mealIndex] = {
          ...meal,
          sideRecipeId: undefined
        };
      }
    }

    setPlan(updatedPlan);
  }, [plan, setPlan]);

  // Handler for updating main leftover status
  const handleMainLeftoverChange = useCallback((day: number, mealTime: 'breakfast' | 'snack' | 'lunch' | 'dinner', isLeftover: boolean) => {
    if (!plan) return;

    const updatedPlan = { ...plan };
    if (!updatedPlan.mealPlan.meals) {
      updatedPlan.mealPlan.meals = [];
    }

    const mealIndex = updatedPlan.mealPlan.meals.findIndex(
      m => m.day === day && m.mealTime === mealTime
    );

    if (mealIndex >= 0) {
      const meal = updatedPlan.mealPlan.meals[mealIndex];
      updatedPlan.mealPlan.meals[mealIndex] = {
        ...meal,
        mainIsLeftover: isLeftover
      };
      setPlan(updatedPlan);

      // Update leftovers Map based on leftover status and portion
      if (meal.recipeId) {
        const portion = meal.mainPortion || 1;
        const serving = meal.mainServing || 1;
        if (isLeftover && portion > 1) {
          // Add to leftovers with (portion - 1) remaining portions and the serving size
          setLeftovers(prev => {
            const newLeftovers = new Map(prev);
            newLeftovers.set(meal.recipeId!, { portions: portion - 1, serving });
            return newLeftovers;
          });
        } else if (!isLeftover) {
          // Remove from leftovers when unchecked
          setLeftovers(prev => {
            const newLeftovers = new Map(prev);
            newLeftovers.delete(meal.recipeId!);
            return newLeftovers;
          });
        }
      }
    }
  }, [plan, setPlan]);

  // Handler for updating side leftover status
  const handleSideLeftoverChange = useCallback((day: number, mealTime: 'breakfast' | 'snack' | 'lunch' | 'dinner', isLeftover: boolean) => {
    if (!plan) return;

    const updatedPlan = { ...plan };
    if (!updatedPlan.mealPlan.meals) {
      updatedPlan.mealPlan.meals = [];
    }

    const mealIndex = updatedPlan.mealPlan.meals.findIndex(
      m => m.day === day && m.mealTime === mealTime
    );

    if (mealIndex >= 0) {
      const meal = updatedPlan.mealPlan.meals[mealIndex];
      updatedPlan.mealPlan.meals[mealIndex] = {
        ...meal,
        sideIsLeftover: isLeftover
      };
      setPlan(updatedPlan);

      // Update leftovers Map based on leftover status and portion
      if (meal.sideRecipeId) {
        const portion = meal.sidePortion || 1;
        const serving = meal.sideServing || 1;
        if (isLeftover && portion > 1) {
          // Add to leftovers with (portion - 1) remaining portions and the serving size
          setLeftovers(prev => {
            const newLeftovers = new Map(prev);
            newLeftovers.set(meal.sideRecipeId!, { portions: portion - 1, serving });
            return newLeftovers;
          });
        } else if (!isLeftover) {
          // Remove from leftovers when unchecked
          setLeftovers(prev => {
            const newLeftovers = new Map(prev);
            newLeftovers.delete(meal.sideRecipeId!);
            return newLeftovers;
          });
        }
      }
    }
  }, [plan, setPlan]);

  // Handler for updating main portion
  const handleMainPortionChange = useCallback((day: number, mealTime: 'breakfast' | 'snack' | 'lunch' | 'dinner', portion: number) => {
    if (!plan) return;

    const updatedPlan = { ...plan };
    if (!updatedPlan.mealPlan.meals) {
      updatedPlan.mealPlan.meals = [];
    }

    const mealIndex = updatedPlan.mealPlan.meals.findIndex(
      m => m.day === day && m.mealTime === mealTime
    );

    if (mealIndex >= 0) {
      const meal = updatedPlan.mealPlan.meals[mealIndex];

      // If portion is reduced to 1, uncheck the leftover status
      const shouldUncheckLeftover = portion === 1 && meal.mainIsLeftover;

      updatedPlan.mealPlan.meals[mealIndex] = {
        ...meal,
        mainPortion: portion,
        ...(shouldUncheckLeftover && { mainIsLeftover: false })
      };
      setPlan(updatedPlan);

      // If portion > 1, create or update leftover with (portion - 1) remaining portions
      if (meal.recipeId && portion > 1) {
        const leftoverCount = portion - 1;
        const serving = meal.mainServing || 1;
        setLeftovers(prev => {
          const newLeftovers = new Map(prev);
          newLeftovers.set(meal.recipeId!, { portions: leftoverCount, serving });
          return newLeftovers;
        });
      } else if (meal.recipeId && portion === 1) {
        // If portion is set to 1, remove from leftovers
        setLeftovers(prev => {
          const newLeftovers = new Map(prev);
          newLeftovers.delete(meal.recipeId!);
          return newLeftovers;
        });
      }
    }
  }, [plan, setPlan]);

  // Handler for updating side portion
  const handleSidePortionChange = useCallback((day: number, mealTime: 'breakfast' | 'snack' | 'lunch' | 'dinner', portion: number) => {
    if (!plan) return;

    const updatedPlan = { ...plan };
    if (!updatedPlan.mealPlan.meals) {
      updatedPlan.mealPlan.meals = [];
    }

    const mealIndex = updatedPlan.mealPlan.meals.findIndex(
      m => m.day === day && m.mealTime === mealTime
    );

    if (mealIndex >= 0) {
      const meal = updatedPlan.mealPlan.meals[mealIndex];

      // If portion is reduced to 1, uncheck the leftover status
      const shouldUncheckLeftover = portion === 1 && meal.sideIsLeftover;

      updatedPlan.mealPlan.meals[mealIndex] = {
        ...meal,
        sidePortion: portion,
        ...(shouldUncheckLeftover && { sideIsLeftover: false })
      };
      setPlan(updatedPlan);

      // If portion > 1, create or update leftover with (portion - 1) remaining portions
      if (meal.sideRecipeId && portion > 1) {
        const leftoverCount = portion - 1;
        const serving = meal.sideServing || 1;
        setLeftovers(prev => {
          const newLeftovers = new Map(prev);
          newLeftovers.set(meal.sideRecipeId!, { portions: leftoverCount, serving });
          return newLeftovers;
        });
      } else if (meal.sideRecipeId && portion === 1) {
        // If portion is set to 1, remove from leftovers
        setLeftovers(prev => {
          const newLeftovers = new Map(prev);
          newLeftovers.delete(meal.sideRecipeId!);
          return newLeftovers;
        });
      }
    }
  }, [plan, setPlan]);

  // Handler for updating main serving
  const handleMainServingChange = useCallback((day: number, mealTime: 'breakfast' | 'snack' | 'lunch' | 'dinner', serving: number) => {
    if (!plan) return;

    const updatedPlan = { ...plan };
    if (!updatedPlan.mealPlan.meals) {
      updatedPlan.mealPlan.meals = [];
    }

    const mealIndex = updatedPlan.mealPlan.meals.findIndex(
      m => m.day === day && m.mealTime === mealTime
    );

    if (mealIndex >= 0) {
      updatedPlan.mealPlan.meals[mealIndex] = {
        ...updatedPlan.mealPlan.meals[mealIndex],
        mainServing: serving
      };
      setPlan(updatedPlan);
    }
  }, [plan, setPlan]);

  // Handler for updating side serving
  const handleSideServingChange = useCallback((day: number, mealTime: 'breakfast' | 'snack' | 'lunch' | 'dinner', serving: number) => {
    if (!plan) return;

    const updatedPlan = { ...plan };
    if (!updatedPlan.mealPlan.meals) {
      updatedPlan.mealPlan.meals = [];
    }

    const mealIndex = updatedPlan.mealPlan.meals.findIndex(
      m => m.day === day && m.mealTime === mealTime
    );

    if (mealIndex >= 0) {
      updatedPlan.mealPlan.meals[mealIndex] = {
        ...updatedPlan.mealPlan.meals[mealIndex],
        sideServing: serving
      };
      setPlan(updatedPlan);
    }
  }, [plan, setPlan]);

  // Handler for entering selection mode to add main recipe
  const handleAddMain = useCallback((day: number, mealTime: 'breakfast' | 'snack' | 'lunch' | 'dinner', isReplacing: boolean = false) => {
    // Close any other views and set this cell as active in selection mode
    setSelectedCell(null);
    setSelectionMode({ day, mealTime, type: 'main', isReplacing });
  }, []);

  // Handler for entering selection mode to add side recipe
  const handleAddSide = useCallback((day: number, mealTime: 'breakfast' | 'snack' | 'lunch' | 'dinner', isReplacing: boolean = false) => {
    // Close any other views and set this cell as active in selection mode
    setSelectedCell(null);
    setSelectionMode({ day, mealTime, type: 'side', isReplacing });
  }, []);

  // Handler for deleting main recipe from a meal
  const handleDeleteMain = useCallback((day: number, mealTime: 'breakfast' | 'snack' | 'lunch' | 'dinner') => {
    if (!plan) return;

    const updatedPlan = { ...plan };
    if (!updatedPlan.mealPlan.meals) {
      updatedPlan.mealPlan.meals = [];
    }

    const mealIndex = updatedPlan.mealPlan.meals.findIndex(
      m => m.day === day && m.mealTime === mealTime
    );

    if (mealIndex >= 0) {
      const meal = updatedPlan.mealPlan.meals[mealIndex];

      // If there's a side recipe, keep the meal but remove main
      if (meal.sideRecipeId) {
        const { recipeId, mainIsLeftover, mainPortion, mainServing, ...rest } = meal;
        updatedPlan.mealPlan.meals[mealIndex] = rest as any;
      } else {
        // No side, remove the entire meal
        updatedPlan.mealPlan.meals.splice(mealIndex, 1);
      }

      setPlan(updatedPlan);

      // Remove from leftovers if it was creating leftovers
      if (meal.recipeId && meal.mainPortion && meal.mainPortion > 1) {
        setLeftovers(prev => {
          const newLeftovers = new Map(prev);
          newLeftovers.delete(meal.recipeId!);
          return newLeftovers;
        });
      }
    }
  }, [plan, setPlan]);

  // Handler for deleting side recipe from a meal
  const handleDeleteSide = useCallback((day: number, mealTime: 'breakfast' | 'snack' | 'lunch' | 'dinner') => {
    if (!plan) return;

    const updatedPlan = { ...plan };
    if (!updatedPlan.mealPlan.meals) {
      updatedPlan.mealPlan.meals = [];
    }

    const mealIndex = updatedPlan.mealPlan.meals.findIndex(
      m => m.day === day && m.mealTime === mealTime
    );

    if (mealIndex >= 0) {
      const meal = updatedPlan.mealPlan.meals[mealIndex];

      // Remove side recipe from the meal
      const { sideRecipeId, sideIsLeftover, sidePortion, sideServing, ...rest } = meal;
      updatedPlan.mealPlan.meals[mealIndex] = rest as any;

      setPlan(updatedPlan);

      // Remove from leftovers if it was creating leftovers
      if (meal.sideRecipeId && meal.sidePortion && meal.sidePortion > 1) {
        setLeftovers(prev => {
          const newLeftovers = new Map(prev);
          newLeftovers.delete(meal.sideRecipeId!);
          return newLeftovers;
        });
      }
    }
  }, [plan, setPlan]);

  // Handler for selecting a recipe in selection mode
  const handleSelectRecipe = useCallback((recipeId: number) => {
    if (!plan || !selectionMode) return;

    const { day, mealTime, type } = selectionMode;
    const updatedPlan = { ...plan };

    if (!updatedPlan.mealPlan.meals) {
      updatedPlan.mealPlan.meals = [];
    }

    const mealIndex = updatedPlan.mealPlan.meals.findIndex(
      m => m.day === day && m.mealTime === mealTime
    );

    if (type === 'main') {
      if (mealIndex >= 0) {
        // Update existing meal's main recipe
        updatedPlan.mealPlan.meals[mealIndex] = {
          ...updatedPlan.mealPlan.meals[mealIndex],
          recipeId,
          mainPortion: 1,
          mainServing: 1
        };
      } else {
        // Add new meal with main recipe
        updatedPlan.mealPlan.meals.push({
          day,
          mealTime: mealTime as 'breakfast' | 'snack' | 'lunch' | 'dinner',
          recipeId,
          mainPortion: 1,
          mainServing: 1
        });
      }
    } else if (type === 'side') {
      if (mealIndex >= 0) {
        // Add side recipe to existing meal
        updatedPlan.mealPlan.meals[mealIndex] = {
          ...updatedPlan.mealPlan.meals[mealIndex],
          sideRecipeId: recipeId,
          sidePortion: 1,
          sideServing: 1
        };
      } else {
        // Add new meal with only side recipe (unusual but handle it)
        updatedPlan.mealPlan.meals.push({
          day,
          mealTime: mealTime as 'breakfast' | 'snack' | 'lunch' | 'dinner',
          recipeId: null,
          sideRecipeId: recipeId,
          sidePortion: 1,
          sideServing: 1
        });
      }
    }

    setPlan(updatedPlan);

    // Return to cell detail view
    setSelectedCell({ day, mealTime });
    setSelectionMode(null); // Exit selection mode
  }, [plan, selectionMode, setPlan]);

  // Handler for closing selection mode
  const handleCloseSelection = useCallback(() => {
    setSelectionMode(null);
  }, []);

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="flex h-screen bg-[#F0F2F3]">
        {/* Sidebar */}
        <Sidebar />

      {/* Left Side Rail - Show ClientLeftRail for client plans, LeftSideRail for templates */}
      {plan?.type === 'client' && plan?.clientId ? (
        <ClientLeftRail clientId={plan.clientId} defaultCollapsed={true} />
      ) : (
        <LeftSideRail
          recentItems={recentItems}
          onRecentItemClick={handleRecentItemClick}
          defaultCollapsed={true}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Client Info Bar / Breadcrumb - Only show for client plans */}
        {plan?.type === 'client' && plan?.clientId && (() => {
          const client = mockUsers.find(u => u.id === plan.clientId);
          if (!client) return null;

          return (
            <div className="bg-[#F0F2F3] flex items-center justify-center px-6 py-2 h-10 border-b border-[#DFE3E4]">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center overflow-hidden shrink-0"
                  style={{ backgroundColor: client.avatarColor }}
                >
                  <Avatar
                    fillType="initials"
                    size="small"
                    initials={client.initials}
                    className="bg-transparent text-[10px]"
                  />
                </div>
                <p className="text-sm font-semibold text-[#244348]">{client.name}</p>
                <span className="text-sm font-medium text-[#657A7E]">/</span>
                <button
                  onClick={handleBack}
                  className="text-sm font-semibold text-[#244348] hover:text-[#0C7791] transition-colors cursor-pointer"
                >
                  Nutrition Plan
                </button>
                <span className="text-sm font-medium text-[#657A7E]">/</span>
                <p className="text-sm font-medium text-[#657A7E]">{mealPlanTitle}</p>
              </div>
            </div>
          );
        })()}

        {/* Top Control Panel - Only show back button for template plans */}
        {plan?.type !== 'client' && (
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
        )}

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

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            {/* Clear Button */}
            <Button variant="ghost" size="md" onClick={handleClearAll}>
              Clear plan
            </Button>

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
            <div className="bg-[#F8F9F9] border-r border-b border-[#C1C9CB] h-full p-3 sticky top-0 left-0 z-20"></div>
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
                  className="w-full sticky top-0 z-10"
                />
              );
            })}

            {/* Add Day Column Header */}
            <div className="border-b border-[#C1C9CB] flex items-center justify-center px-3 py-1 sticky top-0 z-10">
              <button className="flex items-center gap-1 h-8 py-2.5 rounded hover:bg-[#F0F2F3] transition-colors">
                <span className="material-icons text-xl text-[#385459]">add</span>
                <span className="text-sm font-semibold text-[#385459] leading-[1.4]">Add day</span>
              </button>
            </div>

            {/* Breakfast Row */}
            <MealRowHeader label="Breakfast" icon="coffee" className="sticky left-0 z-10" />
            {[1, 2, 3, 4, 5].map((day) => {
              const meal = getMeal(day, 'breakfast');
              const previewMeal = getPreviewMeal(day, 'breakfast');
              const isPreview = isPreviewMeal(day, 'breakfast');

              // Use preview meal if available, otherwise use actual meal
              const displayRecipeId = previewMeal?.recipeId || meal?.recipeId;
              const recipe = displayRecipeId ? getRecipe(displayRecipeId) : null;
              const sideRecipe = meal?.sideRecipeId ? getRecipe(meal.sideRecipeId) : null;

              return recipe ? (
                <DroppableRecipeSlot
                  key={`breakfast-${day}`}
                  day={day}
                  mealTime="breakfast"
                  activeId={activeId}
                  onClick={() => handleCellClick(day, 'breakfast')}
                >
                  <div className={cn(
                    "h-full",
                    isPreview && "bg-[#CFF6DC]",
                    previewMeals && !isPreview && "opacity-50"
                  )}>
                    <MealPlannerRecipeCard
                      title={recipe.title}
                      sideName={sideRecipe?.title}
                      images={[recipe.image, sideRecipe?.image].filter((img): img is string => !!img)}
                      calories={recipe.nutrition?.calories}
                      protein={recipe.nutrition?.protein}
                      sideCalories={sideRecipe?.nutrition?.calories}
                      sideProtein={sideRecipe?.nutrition?.protein}
                      mainIsLeftover={meal?.mainIsFromLeftover}
                      sideIsLeftover={meal?.sideIsFromLeftover}
                      mainHasBulk={meal?.mainIsLeftover}
                      sideHasBulk={meal?.sideIsLeftover}
                      mainPortion={meal?.mainPortion || 1}
                      sidePortion={meal?.sidePortion || 1}
                      mainServing={meal?.mainServing || 1}
                      sideServing={meal?.sideServing || 1}
                      onMainClick={previewMeals ? undefined : (anchorEl) => {
                        setPopoverAnchorElement(anchorEl);
                        setSelectedRecipeId(recipe.id);
                      }}
                      onSideClick={previewMeals ? undefined : (sideRecipe ? (anchorEl) => {
                        setPopoverAnchorElement(anchorEl);
                        setSelectedRecipeId(sideRecipe.id);
                      } : undefined)}
                      onMainDelete={previewMeals ? undefined : () => handleDeleteMain(day, 'breakfast')}
                      onSideDelete={previewMeals || !sideRecipe ? undefined : () => handleDeleteSide(day, 'breakfast')}
                      onMainSwap={previewMeals ? undefined : () => handleAddMain(day, 'breakfast', true)}
                      onSideSwap={previewMeals || !sideRecipe ? undefined : () => handleAddSide(day, 'breakfast', true)}
                      recipeId={recipe.id}
                      day={day}
                      mealTime="breakfast"
                      draggable={!previewMeals}
                      isPreview={isPreview}
                      isSelected={isCellSelected(day, 'breakfast')}
                    />
                  </div>
                </DroppableRecipeSlot>
              ) : (
                <DroppableSlot
                  key={`breakfast-${day}`}
                  day={day}
                  mealTime="breakfast"
                  onClick={() => handleCellClick(day, 'breakfast')}
                  isSelected={isCellSelected(day, 'breakfast')}
                />
              );
            })}
            <div className="border-b border-[#DFE3E4]"></div>

            {/* Snack Row */}
            <MealRowHeader label="Snack" icon="fastfood" className="sticky left-0 z-10" />
            {[1, 2, 3, 4, 5].map((day) => {
              const meal = getMeal(day, 'snack');
              const previewMeal = getPreviewMeal(day, 'snack');
              const isPreview = isPreviewMeal(day, 'snack');

              // Use preview meal if available, otherwise use actual meal
              const displayRecipeId = previewMeal?.recipeId || meal?.recipeId;
              const recipe = displayRecipeId ? getRecipe(displayRecipeId) : null;
              const sideRecipe = meal?.sideRecipeId ? getRecipe(meal.sideRecipeId) : null;

              return recipe ? (
                <DroppableRecipeSlot
                  key={`snack-${day}`}
                  day={day}
                  mealTime="snack"
                  activeId={activeId}
                  onClick={() => handleCellClick(day, 'snack')}
                >
                  <div className={cn(
                    "h-full",
                    isPreview && "bg-[#CFF6DC]",
                    previewMeals && !isPreview && "opacity-50"
                  )}>
                    <MealPlannerRecipeCard
                      title={recipe.title}
                      sideName={sideRecipe?.title}
                      images={[recipe.image, sideRecipe?.image].filter((img): img is string => !!img)}
                      calories={recipe.nutrition?.calories}
                      protein={recipe.nutrition?.protein}
                      sideCalories={sideRecipe?.nutrition?.calories}
                      sideProtein={sideRecipe?.nutrition?.protein}
                      mainIsLeftover={meal?.mainIsFromLeftover}
                      sideIsLeftover={meal?.sideIsFromLeftover}
                      mainHasBulk={meal?.mainIsLeftover}
                      sideHasBulk={meal?.sideIsLeftover}
                      mainPortion={meal?.mainPortion || 1}
                      sidePortion={meal?.sidePortion || 1}
                      mainServing={meal?.mainServing || 1}
                      sideServing={meal?.sideServing || 1}
                      onMainClick={previewMeals ? undefined : (anchorEl) => {
                        setPopoverAnchorElement(anchorEl);
                        setSelectedRecipeId(recipe.id);
                      }}
                      onSideClick={previewMeals ? undefined : (sideRecipe ? (anchorEl) => {
                        setPopoverAnchorElement(anchorEl);
                        setSelectedRecipeId(sideRecipe.id);
                      } : undefined)}
                      onMainDelete={previewMeals ? undefined : () => handleDeleteMain(day, 'snack')}
                      onSideDelete={previewMeals || !sideRecipe ? undefined : () => handleDeleteSide(day, 'snack')}
                      onMainSwap={previewMeals ? undefined : () => handleAddMain(day, 'snack', true)}
                      onSideSwap={previewMeals || !sideRecipe ? undefined : () => handleAddSide(day, 'snack', true)}
                      recipeId={recipe.id}
                      day={day}
                      mealTime="snack"
                      draggable={!previewMeals}
                      isPreview={isPreview}
                      isSelected={isCellSelected(day, 'snack')}
                    />
                  </div>
                </DroppableRecipeSlot>
              ) : (
                <DroppableSlot
                  key={`snack-${day}`}
                  day={day}
                  mealTime="snack"
                  onClick={() => handleCellClick(day, 'snack')}
                  isSelected={isCellSelected(day, 'snack')}
                />
              );
            })}
            <div className="border-b border-[#DFE3E4]"></div>

            {/* Lunch Row */}
            <MealRowHeader label="Lunch" icon="restaurant" className="sticky left-0 z-10" />
            {[1, 2, 3, 4, 5].map((day) => {
              const meal = getMeal(day, 'lunch');
              const previewMeal = getPreviewMeal(day, 'lunch');
              const isPreview = isPreviewMeal(day, 'lunch');

              // Use preview meal if available, otherwise use actual meal
              const displayRecipeId = previewMeal?.recipeId || meal?.recipeId;
              const recipe = displayRecipeId ? getRecipe(displayRecipeId) : null;
              const sideRecipe = meal?.sideRecipeId ? getRecipe(meal.sideRecipeId) : null;

              return recipe ? (
                <DroppableRecipeSlot
                  key={`lunch-${day}`}
                  day={day}
                  mealTime="lunch"
                  activeId={activeId}
                  onClick={() => handleCellClick(day, 'lunch')}
                >
                  <div className={cn(
                    "h-full",
                    isPreview && "bg-[#CFF6DC]",
                    previewMeals && !isPreview && "opacity-50"
                  )}>
                    <MealPlannerRecipeCard
                      title={recipe.title}
                      sideName={sideRecipe?.title}
                      images={[recipe.image, sideRecipe?.image].filter((img): img is string => !!img)}
                      calories={recipe.nutrition?.calories}
                      protein={recipe.nutrition?.protein}
                      sideCalories={sideRecipe?.nutrition?.calories}
                      sideProtein={sideRecipe?.nutrition?.protein}
                      mainIsLeftover={meal?.mainIsFromLeftover}
                      sideIsLeftover={meal?.sideIsFromLeftover}
                      mainHasBulk={meal?.mainIsLeftover}
                      sideHasBulk={meal?.sideIsLeftover}
                      mainPortion={meal?.mainPortion || 1}
                      sidePortion={meal?.sidePortion || 1}
                      mainServing={meal?.mainServing || 1}
                      sideServing={meal?.sideServing || 1}
                      onMainClick={previewMeals ? undefined : (anchorEl) => {
                        setPopoverAnchorElement(anchorEl);
                        setSelectedRecipeId(recipe.id);
                      }}
                      onSideClick={previewMeals ? undefined : (sideRecipe ? (anchorEl) => {
                        setPopoverAnchorElement(anchorEl);
                        setSelectedRecipeId(sideRecipe.id);
                      } : undefined)}
                      onMainDelete={previewMeals ? undefined : () => handleDeleteMain(day, 'lunch')}
                      onSideDelete={previewMeals || !sideRecipe ? undefined : () => handleDeleteSide(day, 'lunch')}
                      onMainSwap={previewMeals ? undefined : () => handleAddMain(day, 'lunch', true)}
                      onSideSwap={previewMeals || !sideRecipe ? undefined : () => handleAddSide(day, 'lunch', true)}
                      recipeId={recipe.id}
                      day={day}
                      mealTime="lunch"
                      draggable={!previewMeals}
                      isPreview={isPreview}
                      isSelected={isCellSelected(day, 'lunch')}
                    />
                  </div>
                </DroppableRecipeSlot>
              ) : (
                <DroppableSlot
                  key={`lunch-${day}`}
                  day={day}
                  mealTime="lunch"
                  onClick={() => handleCellClick(day, 'lunch')}
                  isSelected={isCellSelected(day, 'lunch')}
                />
              );
            })}
            <div className="border-b border-[#DFE3E4]"></div>

            {/* Dinner Row */}
            <MealRowHeader label="Dinner" icon="bedtime" className="sticky left-0 z-10" />
            {[1, 2, 3, 4, 5].map((day) => {
              const meal = getMeal(day, 'dinner');
              const previewMeal = getPreviewMeal(day, 'dinner');
              const isPreview = isPreviewMeal(day, 'dinner');

              // Use preview meal if available, otherwise use actual meal
              const displayRecipeId = previewMeal?.recipeId || meal?.recipeId;
              const recipe = displayRecipeId ? getRecipe(displayRecipeId) : null;
              const sideRecipe = meal?.sideRecipeId ? getRecipe(meal.sideRecipeId) : null;

              return recipe ? (
                <DroppableRecipeSlot
                  key={`dinner-${day}`}
                  day={day}
                  mealTime="dinner"
                  activeId={activeId}
                  onClick={() => handleCellClick(day, 'dinner')}
                >
                  <div className={cn(
                    "h-full",
                    isPreview && "bg-[#CFF6DC]",
                    previewMeals && !isPreview && "opacity-50"
                  )}>
                    <MealPlannerRecipeCard
                      title={recipe.title}
                      sideName={sideRecipe?.title}
                      images={[recipe.image, sideRecipe?.image].filter((img): img is string => !!img)}
                      calories={recipe.nutrition?.calories}
                      protein={recipe.nutrition?.protein}
                      sideCalories={sideRecipe?.nutrition?.calories}
                      sideProtein={sideRecipe?.nutrition?.protein}
                      mainIsLeftover={meal?.mainIsFromLeftover}
                      sideIsLeftover={meal?.sideIsFromLeftover}
                      mainHasBulk={meal?.mainIsLeftover}
                      sideHasBulk={meal?.sideIsLeftover}
                      mainPortion={meal?.mainPortion || 1}
                      sidePortion={meal?.sidePortion || 1}
                      mainServing={meal?.mainServing || 1}
                      sideServing={meal?.sideServing || 1}
                      onMainClick={previewMeals ? undefined : (anchorEl) => {
                        setPopoverAnchorElement(anchorEl);
                        setSelectedRecipeId(recipe.id);
                      }}
                      onSideClick={previewMeals ? undefined : (sideRecipe ? (anchorEl) => {
                        setPopoverAnchorElement(anchorEl);
                        setSelectedRecipeId(sideRecipe.id);
                      } : undefined)}
                      onMainDelete={previewMeals ? undefined : () => handleDeleteMain(day, 'dinner')}
                      onSideDelete={previewMeals || !sideRecipe ? undefined : () => handleDeleteSide(day, 'dinner')}
                      onMainSwap={previewMeals ? undefined : () => handleAddMain(day, 'dinner', true)}
                      onSideSwap={previewMeals || !sideRecipe ? undefined : () => handleAddSide(day, 'dinner', true)}
                      recipeId={recipe.id}
                      day={day}
                      mealTime="dinner"
                      draggable={!previewMeals}
                      isPreview={isPreview}
                      isSelected={isCellSelected(day, 'dinner')}
                    />
                  </div>
                </DroppableRecipeSlot>
              ) : (
                <DroppableSlot
                  key={`dinner-${day}`}
                  day={day}
                  mealTime="dinner"
                  onClick={() => handleCellClick(day, 'dinner')}
                  isSelected={isCellSelected(day, 'dinner')}
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

      {/* Right Side Rail, Cell Detail View, or Recipe Selection View */}
      {selectionMode ? (
        <RecipeSelectionView
          day={selectionMode.day}
          mealTime={selectionMode.mealTime}
          type={selectionMode.type}
          recipes={mockRecipes}
          leftovers={leftovers}
          isReplacing={selectionMode.isReplacing}
          onClose={handleCloseSelection}
          onSelectRecipe={handleSelectRecipe}
          onRecipeClick={(recipe, anchorEl) => {
            setPopoverAnchorElement(anchorEl);
            setSelectedRecipeId(recipe.id);
          }}
        />
      ) : selectedCell ? (
        <CellDetailView
          day={selectedCell.day}
          mealTime={selectedCell.mealTime}
          mainRecipe={(() => {
            const meal = getMeal(selectedCell.day, selectedCell.mealTime);
            return meal?.recipeId ? getRecipe(meal.recipeId) : null;
          })()}
          sideRecipe={(() => {
            const meal = getMeal(selectedCell.day, selectedCell.mealTime);
            return meal?.sideRecipeId ? getRecipe(meal.sideRecipeId) : null;
          })()}
          mainIsLeftover={(() => {
            const meal = getMeal(selectedCell.day, selectedCell.mealTime);
            return meal?.mainIsLeftover || false;
          })()}
          sideIsLeftover={(() => {
            const meal = getMeal(selectedCell.day, selectedCell.mealTime);
            return meal?.sideIsLeftover || false;
          })()}
          mainIsFromLeftover={(() => {
            const meal = getMeal(selectedCell.day, selectedCell.mealTime);
            return meal?.mainIsFromLeftover || false;
          })()}
          sideIsFromLeftover={(() => {
            const meal = getMeal(selectedCell.day, selectedCell.mealTime);
            return meal?.sideIsFromLeftover || false;
          })()}
          mainPortion={(() => {
            const meal = getMeal(selectedCell.day, selectedCell.mealTime);
            return meal?.mainPortion || 1;
          })()}
          sidePortion={(() => {
            const meal = getMeal(selectedCell.day, selectedCell.mealTime);
            return meal?.sidePortion || 1;
          })()}
          mainServing={(() => {
            const meal = getMeal(selectedCell.day, selectedCell.mealTime);
            return meal?.mainServing || 1;
          })()}
          sideServing={(() => {
            const meal = getMeal(selectedCell.day, selectedCell.mealTime);
            return meal?.sideServing || 1;
          })()}
          onClose={handleCloseCellDetail}
          onAddMain={() => handleAddMain(selectedCell.day, selectedCell.mealTime)}
          onAddSide={() => handleAddSide(selectedCell.day, selectedCell.mealTime)}
          onRemoveMain={() => handleRemoveMain(selectedCell.day, selectedCell.mealTime)}
          onRemoveSide={() => handleRemoveSide(selectedCell.day, selectedCell.mealTime)}
          onSwapMain={() => handleAddMain(selectedCell.day, selectedCell.mealTime, true)}
          onSwapSide={() => handleAddSide(selectedCell.day, selectedCell.mealTime, true)}
          onMainLeftoverChange={(isLeftover) => handleMainLeftoverChange(selectedCell.day, selectedCell.mealTime, isLeftover)}
          onSideLeftoverChange={(isLeftover) => handleSideLeftoverChange(selectedCell.day, selectedCell.mealTime, isLeftover)}
          onMainPortionChange={(portion) => handleMainPortionChange(selectedCell.day, selectedCell.mealTime, portion)}
          onSidePortionChange={(portion) => handleSidePortionChange(selectedCell.day, selectedCell.mealTime, portion)}
          onMainServingChange={(serving) => handleMainServingChange(selectedCell.day, selectedCell.mealTime, serving)}
          onSideServingChange={(serving) => handleSideServingChange(selectedCell.day, selectedCell.mealTime, serving)}
          onMainImageClick={(anchorEl) => {
            const meal = getMeal(selectedCell.day, selectedCell.mealTime);
            if (meal?.recipeId) {
              setPopoverAnchorElement(anchorEl);
              setSelectedRecipeId(meal.recipeId);
            }
          }}
          onSideImageClick={(anchorEl) => {
            const meal = getMeal(selectedCell.day, selectedCell.mealTime);
            if (meal?.sideRecipeId) {
              setPopoverAnchorElement(anchorEl);
              setSelectedRecipeId(meal.sideRecipeId);
            }
          }}
        />
      ) : (
        <RightSideRail
          defaultTab="recipes"
          plan={plan}
          leftovers={leftovers}
          onPreviewMealPlan={handlePreviewMealPlan}
          onApplyMealPlan={handleApplyMealPlan}
          onDiscardPreview={handleDiscardPreview}
          hideGeneralSection={true}
        />
      )}

      {/* Recipe Details Popover - rendered separately */}
      {selectedRecipeId && popoverAnchorElement && (
        <RecipeDetailsPopover
          recipe={getRecipe(selectedRecipeId)!}
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedRecipeId(null);
              setPopoverAnchorElement(null);
            }
          }}
          anchorElement={popoverAnchorElement}
        />
      )}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeId ? (() => {
          const activeRecipe = getActiveRecipe();
          if (!activeRecipe) return null;

          // Check if dragging from planner or recipe list
          if (activeId.startsWith('planner-')) {
            // Show MealPlannerRecipeCard for planner items
            return (
              <MealPlannerRecipeCard
                title={activeRecipe.title}
                images={[activeRecipe.image].filter((img): img is string => !!img)}
                calories={activeRecipe.nutrition?.calories}
                protein={activeRecipe.nutrition?.protein}
                className="opacity-60 rotate-3 shadow-lg"
              />
            );
          } else {
            // Show RecipeCard for recipe list items
            return (
              <RecipeCard
                title={activeRecipe.title}
                image={activeRecipe.image}
                time={activeRecipe.time}
                ingredients={activeRecipe.ingredients || 0}
                className="opacity-60 rotate-3 shadow-lg"
              />
            );
          }
        })() : null}
      </DragOverlay>
    </DndContext>
  );
};

export default MealPlanView;
