import type { NutritionPlan } from '../data/mockNutritionPlans';
import { generateMealPlan } from '../data/mockNutritionPlans';
import type { Recipe } from '../components/nutrition-plans/RecipeDetailsPopover';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface AssistantContext {
  plan: NutritionPlan | null;
  availableRecipes: Recipe[];
}

export type ResponseType = 'task' | 'question';

export interface SuggestedMeal {
  day: number;
  mealTime: 'breakfast' | 'snack' | 'lunch' | 'dinner';
  recipeTitle: string;
  recipeId?: number;
  portion?: number;
  serving?: number;
  hasLeftover?: boolean;
  isFromLeftover?: boolean;
}

export interface AssistantResponse {
  content: string;
  type: ResponseType;
  suggestedMeals?: SuggestedMeal[];
}

// Helper function to determine if a message is a task or question
function classifyMessage(message: string): ResponseType {
  const taskKeywords = ['create', 'add', 'swap', 'replace', 'generate', 'fill', 'remove', 'change', 'make', 'update', 'delete'];
  const questionKeywords = ['what', 'which', 'how many', 'tell me', 'show me', 'list'];

  const lowerMessage = message.toLowerCase();

  // Check for task keywords
  const hasTaskKeyword = taskKeywords.some(keyword => lowerMessage.includes(keyword));
  const hasQuestionKeyword = questionKeywords.some(keyword => lowerMessage.includes(keyword));

  // If it has task keywords and no question keywords, it's a task
  if (hasTaskKeyword && !hasQuestionKeyword) {
    return 'task';
  }

  // If it has question keywords, it's a question
  if (hasQuestionKeyword) {
    return 'question';
  }

  // Default to task if unclear
  return 'task';
}

// Helper function to parse meal plan request parameters
function parseMealPlanRequest(message: string): { days: number; isSwap: boolean; targetMealTime?: string } {
  const lowerMessage = message.toLowerCase();

  // Check if this is a swap/replace request
  const isSwap = lowerMessage.includes('swap') || lowerMessage.includes('replace');

  // Detect target meal time for swap
  let targetMealTime: string | undefined;
  if (isSwap) {
    if (lowerMessage.includes('breakfast')) targetMealTime = 'breakfast';
    else if (lowerMessage.includes('lunch')) targetMealTime = 'lunch';
    else if (lowerMessage.includes('dinner')) targetMealTime = 'dinner';
    else if (lowerMessage.includes('snack')) targetMealTime = 'snack';
  }

  // Extract number of days
  let days = 5; // default
  const dayMatch = lowerMessage.match(/(\d+)\s*day/);
  if (dayMatch) {
    days = Math.min(parseInt(dayMatch[1]), 7); // Max 7 days
  } else if (lowerMessage.includes('week')) {
    days = 7;
  }

  return { days, isSwap, targetMealTime };
}

// Helper function to answer questions about the meal plan
function answerQuestion(message: string, context: AssistantContext): string {
  const lowerMessage = message.toLowerCase();
  const { plan, availableRecipes } = context;

  if (!plan) {
    return "No meal plan is currently loaded. Please create a meal plan first.";
  }

  const meals = plan.mealPlan.meals || [];
  const mealsWithRecipes = meals.filter(m => m.recipeId);

  // Count recipes
  if (lowerMessage.includes('how many') && lowerMessage.includes('recipe')) {
    const uniqueRecipes = new Set(mealsWithRecipes.map(m => m.recipeId));
    return `There are ${uniqueRecipes.size} unique recipes in your meal plan across ${mealsWithRecipes.length} meals.`;
  }

  // Most used recipe
  if (lowerMessage.includes('most used') || lowerMessage.includes('most common')) {
    const recipeCounts = new Map<number, number>();
    mealsWithRecipes.forEach(m => {
      const count = recipeCounts.get(m.recipeId!) || 0;
      recipeCounts.set(m.recipeId!, count + 1);
    });

    let mostUsedId = 0;
    let maxCount = 0;
    recipeCounts.forEach((count, id) => {
      if (count > maxCount) {
        maxCount = count;
        mostUsedId = id;
      }
    });

    const recipe = availableRecipes.find(r => r.id === mostUsedId);
    if (recipe) {
      return `"${recipe.title}" is used most frequently, appearing ${maxCount} times in your meal plan.`;
    }
  }

  // Specific day query
  const dayMatch = lowerMessage.match(/day\s*(\d+)/);
  if (dayMatch) {
    const day = parseInt(dayMatch[1]);
    const dayMeals = meals.filter(m => m.day === day && m.recipeId);
    if (dayMeals.length > 0) {
      const mealDescriptions = dayMeals.map(m => {
        const recipe = availableRecipes.find(r => r.id === m.recipeId);
        return `${m.mealTime}: ${recipe?.title || 'Unknown'}`;
      });
      return `Day ${day} has ${dayMeals.length} meals: ${mealDescriptions.join(', ')}.`;
    }
    return `Day ${day} has no meals scheduled yet.`;
  }

  // Nutrition targets
  if (lowerMessage.includes('nutrition') || lowerMessage.includes('target') || lowerMessage.includes('calorie')) {
    const targets = plan.mealPlan.nutritionTargets;
    if (targets) {
      return `Your daily nutrition targets are ${targets.calories} calories, ${targets.protein}g protein, ${targets.carbs}g carbs, ${targets.fat}g fat, and ${targets.fiber}g fiber.`;
    }
    return "No nutrition targets have been set for this meal plan.";
  }

  // General plan info
  if (lowerMessage.includes('what') || lowerMessage.includes('tell me')) {
    const structure = plan.mealPlan.structure || 'structured';
    const numDays = plan.mealPlan.numberOfDays || 5;
    return `This is a ${structure} meal plan for ${numDays} days with ${mealsWithRecipes.length} meals scheduled. ${plan.preferences.dietary.length > 0 ? `Dietary preferences: ${plan.preferences.dietary.join(', ')}.` : ''}`;
  }

  return "I can help you with questions about your meal plan. Try asking about specific days, nutrition targets, or recipe usage.";
}

// Main function to handle assistant requests
export async function sendMessage(
  userMessage: string,
  context: AssistantContext
): Promise<AssistantResponse> {
  try {
    const messageType = classifyMessage(userMessage);

    if (messageType === 'question') {
      // Handle questions about the meal plan
      const answer = answerQuestion(userMessage, context);
      return {
        content: answer,
        type: 'question',
      };
    }

    // Handle task requests (meal plan generation)
    const { plan, availableRecipes } = context;

    if (!plan) {
      return {
        content: "Please create a nutrition plan first before generating meals.",
        type: 'question',
      };
    }

    // Parse the request
    const { days, isSwap, targetMealTime } = parseMealPlanRequest(userMessage);

    // Get available recipe IDs
    const recipeIds = availableRecipes.map(r => r.id);

    if (recipeIds.length === 0) {
      return {
        content: "No recipes available. Please select some recipes first.",
        type: 'question',
      };
    }

    // Handle swap requests differently
    if (isSwap && targetMealTime && plan.mealPlan.meals) {
      // Get current meals for the target meal time
      const currentMeals = plan.mealPlan.meals.filter(m => m.mealTime === targetMealTime && m.recipeId);

      if (currentMeals.length === 0) {
        return {
          content: `No ${targetMealTime} meals found to swap.`,
          type: 'question',
        };
      }

      // Get currently used recipe IDs for this meal time
      const usedRecipeIds = new Set(currentMeals.map(m => m.recipeId));

      // Find alternative recipes that aren't currently used for this meal time
      const alternativeRecipeIds = recipeIds.filter(id => !usedRecipeIds.has(id));

      if (alternativeRecipeIds.length === 0) {
        return {
          content: `All available recipes are already used for ${targetMealTime}. Try adding more recipes first.`,
          type: 'question',
        };
      }

      // Generate new meals for just this meal time
      const structure = plan.mealPlan.structure || 'structured';
      const nutritionTargets = plan.mealPlan.nutritionTargets;
      const newMeals = generateMealPlan(alternativeRecipeIds, structure, nutritionTargets);

      // Filter to only the target meal time and limit to existing days
      const maxDay = Math.max(...currentMeals.map(m => m.day));
      const swappedMeals = newMeals.filter(m => m.mealTime === targetMealTime && m.day <= maxDay);

      // Convert to SuggestedMeal format
      const suggestedMeals: SuggestedMeal[] = swappedMeals.map(meal => {
        const recipe = availableRecipes.find(r => r.id === meal.recipeId);
        return {
          day: meal.day,
          mealTime: meal.mealTime,
          recipeTitle: recipe?.title || 'Unknown Recipe',
          recipeId: meal.recipeId || undefined,
          portion: meal.mainPortion,
          serving: meal.mainServing,
        };
      });

      return {
        content: `Swapped ${suggestedMeals.length} ${targetMealTime} recipes with new variety.`,
        type: 'task',
        suggestedMeals,
      };
    }

    // Generate full meal plan for non-swap requests
    const structure = days === 1 ? 'simple' : 'structured';
    const nutritionTargets = plan.mealPlan.nutritionTargets;

    const meals = generateMealPlan(recipeIds, structure, nutritionTargets);

    // Limit to requested number of days
    const filteredMeals = meals.filter(m => m.day <= days);

    // Convert to SuggestedMeal format
    const suggestedMeals: SuggestedMeal[] = filteredMeals.map(meal => {
      const recipe = availableRecipes.find(r => r.id === meal.recipeId);
      return {
        day: meal.day,
        mealTime: meal.mealTime,
        recipeTitle: recipe?.title || 'Unknown Recipe',
        recipeId: meal.recipeId || undefined,
        portion: meal.mainPortion,
        serving: meal.mainServing,
      };
    });

    // Generate a summary
    const uniqueRecipes = new Set(filteredMeals.map(m => m.recipeId));
    const summary = `Created a ${days}-day meal plan with ${uniqueRecipes.size} recipes. All meals match your preferences.`;

    return {
      content: summary,
      type: 'task',
      suggestedMeals,
    };
  } catch (error) {
    console.error('Assistant error:', error);
    throw new Error('Failed to process your request. Please try again.');
  }
}

// Deprecated - kept for compatibility but no longer uses external API
export async function summarizeText(
  text: string,
  maxLength: number = 100
): Promise<string> {
  // Simple local truncation
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
}
