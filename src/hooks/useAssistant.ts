import { useState, useCallback } from 'react';
import { sendMessage, type AssistantContext, type ResponseType, type SuggestedMeal } from '../api/anthropic';

interface AssistantState {
  userPrompt: string | null;
  response: string | null;
  responseType: ResponseType | null;
  suggestedMeals: SuggestedMeal[] | null;
  isLoading: boolean;
  error: string | null;
}

export function useAssistant(context: AssistantContext) {
  const [state, setState] = useState<AssistantState>({
    userPrompt: null,
    response: null,
    responseType: null,
    suggestedMeals: null,
    isLoading: false,
    error: null,
  });

  const send = useCallback(async (userMessage: string) => {
    if (!userMessage.trim() || state.isLoading) return;

    setState({
      userPrompt: userMessage.trim(),
      response: null,
      responseType: null,
      suggestedMeals: null,
      isLoading: true,
      error: null,
    });

    try {
      const result = await sendMessage(userMessage.trim(), context);

      setState(prev => ({
        ...prev,
        response: result.content,
        responseType: result.type,
        suggestedMeals: result.suggestedMeals || null,
        isLoading: false,
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
      console.error('Assistant error:', err);
    }
  }, [context, state.isLoading]);

  const reset = useCallback(() => {
    setState({
      userPrompt: null,
      response: null,
      responseType: null,
      suggestedMeals: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    send,
    reset,
  };
}
