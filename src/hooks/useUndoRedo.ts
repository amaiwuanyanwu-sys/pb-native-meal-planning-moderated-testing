import { useState, useCallback, useRef } from 'react';

interface UseUndoRedoOptions {
  maxHistory?: number;
}

interface UseUndoRedoReturn<T> {
  state: T;
  setState: (newState: T | ((prevState: T) => T)) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clearHistory: () => void;
}

/**
 * Custom hook for managing undo/redo state history
 * @param initialState - Initial state value
 * @param options - Configuration options (maxHistory)
 * @returns State management object with undo/redo capabilities
 */
export function useUndoRedo<T>(
  initialState: T,
  options: UseUndoRedoOptions = {}
): UseUndoRedoReturn<T> {
  const { maxHistory = 50 } = options;

  // Store the current state
  const [state, setInternalState] = useState<T>(initialState);

  // History stacks
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use ref to track if we're in the middle of undo/redo to prevent adding to history
  const isUndoRedoAction = useRef(false);

  // Set state with history tracking
  const setState = useCallback((newState: T | ((prevState: T) => T)) => {
    setInternalState(prevState => {
      const nextState = typeof newState === 'function'
        ? (newState as (prevState: T) => T)(prevState)
        : newState;

      // Only add to history if not an undo/redo action
      if (!isUndoRedoAction.current) {
        setHistory(prevHistory => {
          // Remove any future states (redo stack) when a new action is performed
          const newHistory = prevHistory.slice(0, currentIndex + 1);
          newHistory.push(nextState);

          // Limit history size
          if (newHistory.length > maxHistory) {
            return newHistory.slice(newHistory.length - maxHistory);
          }

          return newHistory;
        });

        setCurrentIndex(prevIndex => {
          const newIndex = prevIndex + 1;
          // Adjust if we hit max history
          return newIndex >= maxHistory ? maxHistory - 1 : newIndex;
        });
      }

      return nextState;
    });
  }, [currentIndex, maxHistory]);

  // Undo function
  const undo = useCallback(() => {
    if (currentIndex > 0) {
      isUndoRedoAction.current = true;
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setInternalState(history[newIndex]);
      isUndoRedoAction.current = false;
    }
  }, [currentIndex, history]);

  // Redo function
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setInternalState(history[newIndex]);
      isUndoRedoAction.current = false;
    }
  }, [currentIndex, history]);

  // Clear history and reset
  const clearHistory = useCallback(() => {
    setHistory([state]);
    setCurrentIndex(0);
  }, [state]);

  return {
    state,
    setState,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    clearHistory,
  };
}
