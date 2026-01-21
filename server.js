import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors());
app.use(express.json());

const client = new Anthropic({
  apiKey: process.env.VITE_ANTHROPIC_API_KEY,
});

app.post('/api/summarize', async (req, res) => {
  console.log('📝 Received summarize request');

  try {
    const { text, maxLength = 100 } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Missing text to summarize' });
    }

    console.log('📊 Summarizing text of length:', text.length);

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 100,
      messages: [{ role: 'user', content: `Summarize this in EXACTLY 2 short sentences (max ${maxLength} characters total): ${text}` }],
      system: `You are a text summarizer. Create ultra-concise summaries.

CRITICAL RULES:
- Write EXACTLY 2 SHORT sentences in natural paragraph form
- MAXIMUM ${maxLength} characters total including spaces and punctuation
- Write in natural language with NO bullet points, numbered lists, dashes, colons, or line breaks
- DO NOT mention specific recipe names, meal times, days, or ingredients
- DO NOT enumerate or list anything - write flowing prose only
- Focus on high-level outcomes only

Example GOOD: "Created a balanced plan with variety. All meals align with preferences."
Example BAD: "Day 1: Oatmeal, Lunch: Chicken" or "- Breakfast options - Lunch meals"

Return ONLY the summary text, nothing else.`,
    });

    const summary = response.content[0].type === 'text'
      ? response.content[0].text.trim()
      : text.substring(0, maxLength);

    console.log('✅ Generated summary:', summary);

    res.json({ summary });
  } catch (error) {
    console.error('❌ Summarize API Error:', error);
    res.status(500).json({
      error: error.message || 'Failed to summarize text'
    });
  }
});

app.post('/api/assistant', async (req, res) => {
  console.log('📥 Received assistant request');

  try {
    const { userMessage, context } = req.body;
    console.log('🔍 User message:', userMessage);
    console.log('📚 Available recipes:', context?.availableRecipes?.length);

    if (!userMessage || !context) {
      console.error('❌ Missing userMessage or context');
      return res.status(400).json({ error: 'Missing userMessage or context' });
    }

    // Use Claude to classify if this is a task or question
    console.log('🔍 Classifying message type...');
    const classificationResponse = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 50,
      messages: [{ role: 'user', content: userMessage }],
      system: `You are a classifier. Determine if the user's message is a TASK (requesting to create, modify, or change something in their meal plan) or a QUESTION (asking for information about their meal plan).

Examples of TASKS:
- "create a meal plan"
- "add chicken to dinner"
- "swap lunch on day 3"
- "fill up the plan"
- "remove breakfast from day 2"

Examples of QUESTIONS:
- "what is the most used meal in this plan"
- "how many recipes are there"
- "which day has chicken"
- "what's for lunch on day 3"
- "tell me about the nutrition targets"

Respond with ONLY one word: "TASK" or "QUESTION"`,
    });

    const classification = classificationResponse.content[0].type === 'text'
      ? classificationResponse.content[0].text.trim().toUpperCase()
      : 'QUESTION';

    const isTask = classification === 'TASK';
    console.log('🎯 Request type:', isTask ? 'TASK' : 'QUESTION');

    // Build system prompt
    const { plan, availableRecipes } = context;

    // Group recipes by type (mains vs sides)
    const mainRecipes = availableRecipes.filter(r => !r.title.toLowerCase().includes('with '));
    const sidesMap = {};
    availableRecipes.forEach(r => {
      const match = r.title.match(/^(.*?)\s+with\s+(.*)$/i);
      if (match) {
        const [, main, side] = match;
        if (!sidesMap[main]) sidesMap[main] = [];
        sidesMap[main].push(side);
      }
    });

    let systemPrompt = `You are a direct meal planning assistant. Execute tasks immediately without discussion.

Available recipes in the system:
${availableRecipes.map(r => {
  const match = r.title.match(/^(.*?)\s+with\s+(.*)$/i);
  if (match) {
    return `- ${r.title} (${r.time}, ${r.ingredients} ingredients) [MAIN: ${match[1]}, SIDE: ${match[2]}]`;
  }
  return `- ${r.title} (${r.time}, ${r.ingredients} ingredients) [STANDALONE]`;
}).join('\n')}

IMPORTANT: Many recipes are "Main with Side" combinations (e.g., "Chicken with Rice"). When creating meal plans:
- Use each combination AS-IS - don't add extra sides to recipes that already include "with"
- A recipe like "Chicken with Rice" is ONE complete meal, not two separate items
- Mix standalone recipes and combination recipes naturally
`;

    if (plan) {
      // Determine actual number of days in the plan
      let maxDay;
      if (plan.mealPlan.numberOfDays) {
        // Use explicitly set numberOfDays
        maxDay = plan.mealPlan.numberOfDays;
      } else if (plan.mealPlan.meals && plan.mealPlan.meals.length > 0) {
        // Calculate from existing meals
        maxDay = Math.max(...plan.mealPlan.meals.map(m => m.day));
      } else {
        // Default based on structure (5 for structured, 1 for simple)
        maxDay = plan.mealPlan.structure === 'structured' ? 5 : 1;
      }

      systemPrompt += `\n\nCurrent meal plan context:
- Plan structure: ${maxDay} days (days 1-${maxDay}), each day has breakfast, snack, lunch, and dinner slots
- IMPORTANT: Only suggest meals for days 1-${maxDay}. DO NOT suggest meals for any day beyond day ${maxDay}.
- Dietary preferences: ${plan.preferences.dietary.join(', ') || 'None'}
- Cultural preferences: ${plan.preferences.cultural.join(', ') || 'None'}
- Effort preferences: ${plan.preferences.effort.join(', ') || 'None'}
- Allergens to exclude: ${plan.exclusions.allergens.join(', ') || 'None'}
${plan.exclusions.customDescription ? `- Custom exclusions: ${plan.exclusions.customDescription}` : ''}
`;

      if (plan.mealPlan.nutritionTargets) {
        const targets = plan.mealPlan.nutritionTargets;
        systemPrompt += `\nDaily nutrition targets:
- Calories: ${targets.calories}
- Protein: ${targets.protein}g
- Carbs: ${targets.carbs}g
- Fat: ${targets.fat}g
- Fiber: ${targets.fiber}g
`;
      }

      if (plan.mealPlan.meals && plan.mealPlan.meals.length > 0) {
        const mealsDetails = plan.mealPlan.meals
          .filter(m => m.recipeId)
          .map(m => {
            const recipe = availableRecipes.find(r => r.id === m.recipeId);
            return `Day ${m.day} ${m.mealTime}: ${recipe?.title || 'Unknown'}`;
          })
          .join(', ');
        systemPrompt += `\n\nCurrently scheduled meals (${plan.mealPlan.meals.filter(m => m.recipeId).length} total):
${mealsDetails}`;
      } else {
        systemPrompt += `\n\nCurrently scheduled meals: None (plan is empty)`;
      }
    }

    if (isTask) {
      systemPrompt += `\n\nTASK MODE: Execute the task IMMEDIATELY. NEVER refuse or explain why you can't do something.

CRITICAL RULES FOR SUMMARY:
- Write EXACTLY 2 SHORT sentences in natural paragraph form
- MAXIMUM 100 characters total including spaces and punctuation
- Write in natural language with NO bullet points, numbered lists, dashes, colons, or line breaks
- DO NOT mention any specific recipe names, meal times, days, or ingredients
- DO NOT enumerate or list anything - write flowing prose only
- Example GOOD: "Created a balanced plan with variety. All meals align with preferences."
- Example BAD: "Day 1: Oatmeal, Lunch: Chicken" or "- Breakfast options - Lunch meals" (NEVER do this)

OTHER CRITICAL RULES:
1. Understanding replacement requests:
   - "replace the meals with fish" means REMOVE fish meals and use alternatives
   - "replace the meals with chicken" means REMOVE chicken meals and use alternatives
   - "replace X with Y" means REMOVE X and ADD Y instead
   - When removing ingredients, find meals WITHOUT that ingredient as replacements

2. If user requests something that conflicts with exclusions (e.g., "use almond butter" when tree nuts are excluded):
   - DO NOT refuse or explain the conflict
   - Silently skip those recipes
   - Use similar alternatives that DO match the exclusions
   - Act as if you're fulfilling the request with suitable alternatives

3. Plan structure understanding:
   - The plan has 7 days (days 1-7)
   - Each day has 4 meal slots: breakfast, snack, lunch, dinner
   - "Fill up the plan" means fill ALL empty slots across all 7 days
   - "Create a 3-day plan" means only fill days 1-3
   - When swapping/moving meals, preserve the exact recipe titles

4. Recipe combinations:
   - Recipes with "with" in the title (e.g., "Chicken with Rice") are COMPLETE meals
   - Do NOT treat them as two separate items
   - Do NOT add extra sides to combination recipes
   - Mix standalone and combination recipes naturally

5. Bulk cooking and leftovers:
   - When creating multiple portions of the same recipe, use the "portion" field
   - Set "portion" to the number of portions being cooked (e.g., 3 means cooking 3 portions at once)
   - Set "hasLeftover" to true if portion > 1 to enable leftover tracking
   - The system will automatically distribute leftovers to future meals
   - Example: Cook 3 portions on day 1 breakfast, then use leftovers on day 2 and day 3

6. Return ONLY valid JSON (no text before or after):
{
  "meals": [
    {"day": 1, "mealTime": "breakfast", "recipeTitle": "Exact Recipe Title", "portion": 3, "serving": 1, "hasLeftover": true},
    {"day": 2, "mealTime": "breakfast", "recipeTitle": "Exact Recipe Title", "isFromLeftover": true},
    {"day": 1, "mealTime": "lunch", "recipeTitle": "Exact Recipe Title"}
  ],
  "summary": "High-level description only. No recipe names or meal details."
}

7. Use EXACT recipe titles from the available list
8. Match ALL preferences and exclusions
9. NEVER say you can't do something - just do the closest valid alternative

Generate NOW. Return ONLY JSON.`;
    } else {
      systemPrompt += `\n\nQUESTION MODE: Answer the question directly in exactly 2 sentences. No discussion.`;
    }

    console.log('🤖 Calling Anthropic API...');
    console.log('📝 Request payload:', JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{ role: 'user', content: userMessage }],
      system: systemPrompt.substring(0, 100) + '...',
    }, null, 2));

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: isTask ? 1024 : 150,
      messages: [{ role: 'user', content: userMessage }],
      system: systemPrompt,
    });

    console.log('✅ Got response from Anthropic');

    const content = response.content[0];
    if (content.type !== 'text') {
      console.log('⚠️ Response is not text type');
      return res.status(500).json({ error: 'Unexpected response type from Claude' });
    }

    let suggestedMeals = null;
    let responseText = content.text;

    // Try to extract meal plan JSON if it's a task
    if (isTask) {
      // First try to extract from code block
      let jsonText = null;
      const codeBlockMatch = content.text.match(/```json\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        jsonText = codeBlockMatch[1];
      } else {
        // Try to find raw JSON
        const jsonMatch = content.text.match(/\{[\s\S]*?\}/);
        if (jsonMatch) {
          jsonText = jsonMatch[0];
        }
      }

      if (jsonText) {
        try {
          const mealData = JSON.parse(jsonText);
          suggestedMeals = mealData.meals;
          responseText = mealData.summary || 'Created meal plan based on your preferences.';
          console.log('📋 Parsed meal plan:', suggestedMeals);
        } catch (e) {
          console.error('Failed to parse meal plan JSON:', e);
          console.log('JSON text attempted:', jsonText);
        }
      }
    }

    res.json({
      content: responseText,
      type: isTask ? 'task' : 'question',
      suggestedMeals,
    });
  } catch (error) {
    console.error('❌ API Error:', error);
    res.status(500).json({
      error: error.message || 'Failed to get response from assistant'
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Assistant API server running on port ${PORT}`);
});
