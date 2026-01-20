export interface MealSlot {
  day: number; // 1-5 for 5-day plan
  mealTime: 'breakfast' | 'snack' | 'lunch' | 'dinner';
  recipeId: number | null;
  sideRecipeId?: number | null; // Optional side dish
  mainIsLeftover?: boolean; // Whether the main recipe is marked as leftover
  sideIsLeftover?: boolean; // Whether the side recipe is marked as leftover
  mainIsFromLeftover?: boolean; // Whether the main recipe was added from the leftover list
  sideIsFromLeftover?: boolean; // Whether the side recipe was added from the leftover list
  mainServing?: number; // Serving multiplier for main recipe (default 1)
  sideServing?: number; // Serving multiplier for side recipe (default 1)
  mainPortion?: number; // Portion for main recipe (default 1)
  sidePortion?: number; // Portion for side recipe (default 1)
}

export interface NutritionPlan {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: 'client' | 'template';

  // Metadata
  clientId?: string;              // If type === 'client'
  templateName?: string;          // If type === 'template'

  // Wizard data
  preferences: {
    dietary: string[];
    cultural: string[];
    effort: string[];
  };

  exclusions: {
    allergens: string[];
    customDescription?: string;
  };

  recipeIds: number[];

  mealPlan: {
    includesMealPlan: boolean;
    structure?: 'structured' | 'simple';
    numberOfDays?: number; // Number of days in the meal plan (e.g., 5 for structured, 1 for simple)
    nutritionTargets?: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
    };
    importance?: 'grocery' | 'variety' | 'other';
    meals?: MealSlot[]; // Generated meal plan assignments
  };
}

const STORAGE_KEY = 'nutritionPlans';

export function generatePlanId(): string {
  return crypto.randomUUID();
}

export function savePlan(plan: NutritionPlan): void {
  const plans = loadPlans();
  plans.push(plan);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

export function loadPlans(): NutritionPlan[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function updatePlanAccessTime(planId: string): void {
  const plans = loadPlans();
  const planIndex = plans.findIndex(p => p.id === planId);
  if (planIndex !== -1) {
    plans[planIndex].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  }
}

export function updatePlan(updatedPlan: NutritionPlan): void {
  const plans = loadPlans();
  const planIndex = plans.findIndex(p => p.id === updatedPlan.id);
  if (planIndex !== -1) {
    plans[planIndex] = {
      ...updatedPlan,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  }
}

export function deletePlan(planId: string): void {
  const plans = loadPlans();
  const filteredPlans = plans.filter(p => p.id !== planId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPlans));
}

// Import recipe data for optimization
import { mockRecipes } from './mockRecipes';
import type { Recipe } from '@/components/nutrition-plans/RecipeDetailsPopover';

// Types for optimization
interface NutritionTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface NutrientGap {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface MealAssignment {
  recipeId: number;
  portion: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

// Calculate total nutrition from a meal slot (including portion)
function calculateMealNutrition(recipe: Recipe, portion: number = 1): NutrientGap {
  return {
    calories: (recipe.nutrition?.calories || 0) * portion,
    protein: (recipe.nutrition?.protein || 0) * portion,
    carbs: (recipe.nutrition?.carbs || 0) * portion,
    fat: (recipe.nutrition?.fat || 0) * portion,
    fiber: (recipe.nutrition?.fiber || 0) * portion,
  };
}

// Calculate nutrient gap between current totals and targets
function calculateNutrientGap(current: NutrientGap, target: NutritionTargets): NutrientGap {
  return {
    calories: target.calories - current.calories,
    protein: target.protein - current.protein,
    carbs: target.carbs - current.carbs,
    fat: target.fat - current.fat,
    fiber: target.fiber - current.fiber,
  };
}

// Score how well a recipe fills the nutrient gap
function scoreRecipeForGap(recipe: Recipe, gap: NutrientGap, portion: number = 1): number {
  const recipeNutrition = calculateMealNutrition(recipe, portion);
  let score = 0;

  // Positive points for filling gaps (when we need more nutrients)
  if (gap.calories > 0) score += Math.min(recipeNutrition.calories / gap.calories, 1) * 30;
  if (gap.protein > 0) score += Math.min(recipeNutrition.protein / gap.protein, 1) * 25;
  if (gap.carbs > 0) score += Math.min(recipeNutrition.carbs / gap.carbs, 1) * 20;
  if (gap.fat > 0) score += Math.min(recipeNutrition.fat / gap.fat, 1) * 15;
  if (gap.fiber > 0) score += Math.min(recipeNutrition.fiber / gap.fiber, 1) * 10;

  // Negative points for overshooting (when we'd exceed targets)
  if (gap.calories < 0 && recipeNutrition.calories > Math.abs(gap.calories) * 0.1) score -= 20;
  if (gap.protein < 0 && recipeNutrition.protein > Math.abs(gap.protein) * 0.1) score -= 15;
  if (gap.carbs < 0 && recipeNutrition.carbs > Math.abs(gap.carbs) * 0.1) score -= 10;
  if (gap.fat < 0 && recipeNutrition.fat > Math.abs(gap.fat) * 0.1) score -= 10;

  return Math.max(0, score); // Never return negative scores
}

// Find the best recipe for a given meal time and nutrient gap
function selectBestRecipe(
  availableRecipes: Recipe[],
  gap: NutrientGap,
  mealTime: 'breakfast' | 'snack' | 'lunch' | 'dinner',
  usedTodayIds: Set<number>,
  weeklyUsage?: Map<number, number>
): MealAssignment | null {
  // Categorize recipes with scoring (higher score = better fit)
  const scoredRecipes = availableRecipes
    .filter(recipe => !usedTodayIds.has(recipe.id))
    .map(recipe => {
      let mealTimeFitScore = 0;
      const calories = recipe.nutrition?.calories || 0;
      const tags = recipe.tags || [];
      const tagStr = tags.join(' ').toLowerCase();

      if (mealTime === 'breakfast') {
        // Strongly prefer breakfast-tagged recipes
        if (tagStr.includes('breakfast')) mealTimeFitScore = 100;
        // Also good: quick meals or light meals
        else if (tagStr.includes('quick') || recipe.time === '5 mins' || recipe.time === '3 mins') mealTimeFitScore = 70;
        else if (calories <= 400) mealTimeFitScore = 50;
        else mealTimeFitScore = 20; // Still allow any recipe
      } else if (mealTime === 'snack') {
        // Strongly prefer snack-tagged recipes
        if (tagStr.includes('snack')) mealTimeFitScore = 100;
        // Also good: light meals
        else if (calories <= 350) mealTimeFitScore = 70;
        else if (calories <= 450) mealTimeFitScore = 40;
        else mealTimeFitScore = 10; // Still allow, but discourage
      } else {
        // Lunch/Dinner: prefer substantial meals
        if (calories >= 400) mealTimeFitScore = 100;
        else if (calories >= 300) mealTimeFitScore = 80;
        else if (calories >= 200) mealTimeFitScore = 50;
        else mealTimeFitScore = 20; // Still allow smaller meals
      }

      return { recipe, mealTimeFitScore };
    })
    .filter(({ mealTimeFitScore }) => mealTimeFitScore > 0);

  const suitableRecipes = scoredRecipes.map(({ recipe }) => recipe);

  if (suitableRecipes.length === 0) {
    // Fallback: use any unused recipe from today
    const fallbackRecipes = availableRecipes.filter(r => !usedTodayIds.has(r.id));
    if (fallbackRecipes.length === 0) return null;

    const recipe = fallbackRecipes[0];
    return {
      recipeId: recipe.id,
      portion: 1,
      nutrition: calculateMealNutrition(recipe, 1),
    };
  }

  // Sort recipes by weekly usage (prefer least used)
  const sortedRecipes = [...suitableRecipes].sort((a, b) => {
    const usageA = weeklyUsage?.get(a.id) || 0;
    const usageB = weeklyUsage?.get(b.id) || 0;
    return usageA - usageB; // Ascending order (least used first)
  });

  // Try different portion sizes and find the best combination
  let bestAssignment: MealAssignment | null = null;
  let bestScore = -1;

  for (const recipe of sortedRecipes) {
    // Always use portion of 1 (users can adjust manually if needed)
    const portion = 1;
    let score = scoreRecipeForGap(recipe, gap, portion);

    // Bonus points for recipes that haven't been used yet this week
    const usage = weeklyUsage?.get(recipe.id) || 0;
    if (usage === 0) {
      score += 10; // Bonus for variety
    } else {
      score -= usage * 2; // Penalty for overused recipes
    }

    if (score > bestScore) {
      bestScore = score;
      bestAssignment = {
        recipeId: recipe.id,
        portion,
        nutrition: calculateMealNutrition(recipe, portion),
      };
    }
  }

  return bestAssignment;
}

// Optimized meal plan generation algorithm
export function generateMealPlan(
  recipeIds: number[],
  structure: 'structured' | 'simple',
  nutritionTargets?: NutritionTargets
): MealSlot[] {
  const meals: MealSlot[] = [];
  const availableRecipes = mockRecipes.filter(r => recipeIds.includes(r.id));

  // If no nutrition targets provided, use simple algorithm
  if (!nutritionTargets) {
    return generateSimpleMealPlan(recipeIds, structure);
  }

  if (structure === 'structured') {
    // For structured plan: 5 days × 4 meal times = 20 slots
    const mealTimes: Array<'breakfast' | 'snack' | 'lunch' | 'dinner'> = ['breakfast', 'snack', 'lunch', 'dinner'];
    const numDays = 5;

    // Track recipe usage across the entire week by meal time to maximize variety
    const usageByMealTime: Record<string, Map<number, number>> = {
      breakfast: new Map(),
      snack: new Map(),
      lunch: new Map(),
      dinner: new Map(),
    };

    for (let day = 1; day <= numDays; day++) {
      // Track nutrients for this day
      let dailyNutrition: NutrientGap = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
      };

      // Track which recipes we've used today to avoid repeating on same day
      const usedTodayIds = new Set<number>();

      for (const mealTime of mealTimes) {
        // Calculate remaining gap for the day
        const gap = calculateNutrientGap(dailyNutrition, nutritionTargets);

        // For snacks, reduce the target gap since they should be smaller portions
        const adjustedGap = mealTime === 'snack' ? {
          calories: gap.calories * 0.15, // Snacks ~15% of remaining calories
          protein: gap.protein * 0.15,
          carbs: gap.carbs * 0.15,
          fat: gap.fat * 0.15,
          fiber: gap.fiber * 0.15,
        } : gap;

        // Select the best recipe for this meal, considering both daily and weekly variety
        const assignment = selectBestRecipe(
          availableRecipes,
          adjustedGap,
          mealTime,
          usedTodayIds,
          usageByMealTime[mealTime]
        );

        if (assignment) {
          meals.push({
            day,
            mealTime,
            recipeId: assignment.recipeId,
            mainPortion: assignment.portion,
          });

          // Update daily totals
          dailyNutrition.calories += assignment.nutrition.calories;
          dailyNutrition.protein += assignment.nutrition.protein;
          dailyNutrition.carbs += assignment.nutrition.carbs;
          dailyNutrition.fat += assignment.nutrition.fat;
          dailyNutrition.fiber += assignment.nutrition.fiber;

          usedTodayIds.add(assignment.recipeId);

          // Track usage for this meal time across the week
          const currentUsage = usageByMealTime[mealTime].get(assignment.recipeId) || 0;
          usageByMealTime[mealTime].set(assignment.recipeId, currentUsage + 1);
        } else {
          // No suitable recipe found, leave slot empty
          meals.push({
            day,
            mealTime,
            recipeId: null,
          });
        }
      }
    }
  } else {
    // Simple plan: just group recipes by meal type without optimization
    return generateSimpleMealPlan(recipeIds, structure);
  }

  return meals;
}

// Fallback simple meal plan generation (no optimization)
function generateSimpleMealPlan(recipeIds: number[], structure: 'structured' | 'simple'): MealSlot[] {
  const meals: MealSlot[] = [];

  if (structure === 'structured') {
    // For structured plan: 5 days × 4 meal times = 20 slots
    const mealTimes: Array<'breakfast' | 'snack' | 'lunch' | 'dinner'> = ['breakfast', 'snack', 'lunch', 'dinner'];
    const numDays = 5;

    // Distribute recipes across slots, cycling through if needed
    let recipeIndex = 0;
    for (let day = 1; day <= numDays; day++) {
      for (const mealTime of mealTimes) {
        // Skip snack slots in simple mode
        if (mealTime === 'snack') {
          meals.push({
            day,
            mealTime,
            recipeId: null,
          });
        } else {
          // Cycle through recipes if we've used them all
          meals.push({
            day,
            mealTime,
            recipeId: recipeIds[recipeIndex % recipeIds.length],
          });
          recipeIndex++;
        }
      }
    }
  } else {
    // For simple plan: Group recipes by meal type
    // Just assign recipes to meal times without specific days
    const mealTimes: Array<'breakfast' | 'snack' | 'lunch' | 'dinner'> = ['breakfast', 'lunch', 'dinner'];
    const recipesPerMealTime = Math.ceil(recipeIds.length / mealTimes.length);

    let recipeIndex = 0;
    mealTimes.forEach(mealTime => {
      const count = Math.min(recipesPerMealTime, recipeIds.length - recipeIndex);
      for (let i = 0; i < count; i++) {
        meals.push({
          day: 1, // For simple plans, day doesn't matter as much
          mealTime,
          recipeId: recipeIds[recipeIndex],
        });
        recipeIndex++;
      }
    });
  }

  return meals;
}
