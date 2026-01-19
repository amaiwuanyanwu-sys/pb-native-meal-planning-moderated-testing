export interface MealSlot {
  day: number; // 1-5 for 5-day plan
  mealTime: 'breakfast' | 'snack' | 'lunch' | 'dinner';
  recipeId: number | null;
  sideRecipeId?: number | null; // Optional side dish
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

// Simple meal plan generation algorithm
export function generateMealPlan(recipeIds: number[], structure: 'structured' | 'simple'): MealSlot[] {
  const meals: MealSlot[] = [];

  if (structure === 'structured') {
    // For structured plan: 5 days × 4 meal times = 20 slots
    const mealTimes: Array<'breakfast' | 'snack' | 'lunch' | 'dinner'> = ['breakfast', 'snack', 'lunch', 'dinner'];
    const numDays = 5;

    // Distribute recipes across slots, cycling through if needed
    let recipeIndex = 0;
    for (let day = 1; day <= numDays; day++) {
      for (const mealTime of mealTimes) {
        // Skip snack slots
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
