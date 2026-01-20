import type { NutritionPlan } from '../data/mockNutritionPlans';
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
}

export interface AssistantResponse {
  content: string;
  type: ResponseType;
  suggestedMeals?: SuggestedMeal[];
}

const API_URL = 'http://localhost:3001';

export async function summarizeText(
  text: string,
  maxLength: number = 100
): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/api/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        maxLength,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to summarize text');
    }

    const data = await response.json();
    return data.summary;
  } catch (error) {
    console.error('Summarize error:', error);
    // Fallback to truncating the text
    return text.substring(0, maxLength);
  }
}

export async function sendMessage(
  userMessage: string,
  context: AssistantContext
): Promise<AssistantResponse> {
  try {
    const response = await fetch(`${API_URL}/api/assistant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userMessage,
        context,
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to get response from assistant';
      try {
        const error = await response.json();
        errorMessage = error.error || errorMessage;
      } catch {
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // If it's a task response and the summary is too long, re-summarize it
    if (data.type === 'task' && data.content && data.content.length > 100) {
      console.log('Summary too long, re-summarizing...');
      data.content = await summarizeText(data.content, 100);
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to assistant server. Make sure the server is running on port 3001.');
    }
    throw error;
  }
}
