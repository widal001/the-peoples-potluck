/**
 * Quiz state store
 * Manages quiz progress, answers, and results with localStorage persistence
 */

import { writable, derived, get } from "svelte/store";
import type { ArchetypeId, QuizAnswer, AxisCounts } from "@/config/quiz/types";
import {
  TOTAL_QUESTIONS,
  calculateAxisCounts,
  calculateResult,
  getScenarioById,
} from "@/lib/quiz";

// Storage key for localStorage persistence
const STORAGE_KEY = "potluck-quiz-state";

// Quiz state interface
export interface QuizState {
  answers: QuizAnswer[];
  currentQuestion: number; // 1-indexed
  isComplete: boolean;
}

// Initial state
const initialState: QuizState = {
  answers: [],
  currentQuestion: 1,
  isComplete: false,
};

// Try to load state from localStorage
function loadFromStorage(): QuizState | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate structure
      if (
        Array.isArray(parsed.answers) &&
        typeof parsed.currentQuestion === "number"
      ) {
        return {
          answers: parsed.answers,
          currentQuestion: parsed.currentQuestion,
          isComplete: parsed.isComplete ?? false,
        };
      }
    }
  } catch {
    // Invalid storage, ignore
  }
  return null;
}

// Save state to localStorage
function saveToStorage(state: QuizState): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable, ignore
  }
}

// Clear storage
function clearStorage(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable, ignore
  }
}

// Create the quiz store
function createQuizStore() {
  const { subscribe, set, update } = writable<QuizState>(initialState);

  return {
    subscribe,

    // Initialize from localStorage (call on mount)
    initialize: () => {
      const stored = loadFromStorage();
      if (stored) {
        set(stored);
      }
    },

    // Record answer for current question (without advancing)
    recordAnswer: (scenarioId: string) => {
      update((state) => {
        const scenario = getScenarioById(scenarioId);
        if (!scenario) return state;

        const answer: QuizAnswer = {
          questionId: state.currentQuestion,
          scenarioId,
          archetypeId: scenario.archetypeId,
        };

        // Remove existing answer for this question if any
        const existingIndex = state.answers.findIndex(
          (a) => a.questionId === state.currentQuestion
        );

        let newAnswers: QuizAnswer[];
        if (existingIndex >= 0) {
          newAnswers = [...state.answers];
          newAnswers[existingIndex] = answer;
        } else {
          newAnswers = [...state.answers, answer];
        }

        const newState = {
          ...state,
          answers: newAnswers,
        };

        saveToStorage(newState);
        return newState;
      });
    },

    // Advance to next question (or mark complete if at end)
    advanceQuestion: () => {
      update((state) => {
        const isComplete = state.currentQuestion >= TOTAL_QUESTIONS;
        
        if (isComplete) {
          const newState = { ...state, isComplete: true };
          saveToStorage(newState);
          return newState;
        }

        const newState = {
          ...state,
          currentQuestion: state.currentQuestion + 1,
        };
        saveToStorage(newState);
        return newState;
      });
    },

    // Go to next question
    nextQuestion: () => {
      update((state) => {
        if (state.currentQuestion >= TOTAL_QUESTIONS) return state;

        const newState = {
          ...state,
          currentQuestion: state.currentQuestion + 1,
        };
        saveToStorage(newState);
        return newState;
      });
    },

    // Go to previous question
    previousQuestion: () => {
      update((state) => {
        if (state.currentQuestion <= 1) return state;

        const newState = {
          ...state,
          currentQuestion: state.currentQuestion - 1,
          isComplete: false, // Going back means not complete
        };
        saveToStorage(newState);
        return newState;
      });
    },

    // Go to specific question
    goToQuestion: (questionId: number) => {
      update((state) => {
        if (questionId < 1 || questionId > TOTAL_QUESTIONS) return state;

        const newState = {
          ...state,
          currentQuestion: questionId,
          isComplete: false,
        };
        saveToStorage(newState);
        return newState;
      });
    },

    // Mark as complete (for when viewing results)
    markComplete: () => {
      update((state) => {
        const newState = {
          ...state,
          isComplete: true,
        };
        saveToStorage(newState);
        return newState;
      });
    },

    // Reset quiz
    reset: () => {
      clearStorage();
      set(initialState);
    },

    // Get current answer for a question
    getAnswerForQuestion: (questionId: number): QuizAnswer | undefined => {
      const state = get({ subscribe });
      return state.answers.find((a) => a.questionId === questionId);
    },
  };
}

// Export the store instance
export const quizStore = createQuizStore();

// Derived store: axis counts from current answers
export const axisCounts = derived(quizStore, ($quiz): AxisCounts => {
  return calculateAxisCounts($quiz.answers);
});

// Derived store: calculated result (only valid when complete)
export const quizResult = derived(quizStore, ($quiz): ArchetypeId | null => {
  if ($quiz.answers.length < TOTAL_QUESTIONS) return null;
  return calculateResult($quiz.answers);
});

// Derived store: progress percentage
export const quizProgress = derived(quizStore, ($quiz): number => {
  return ($quiz.answers.length / TOTAL_QUESTIONS) * 100;
});

// Derived store: can go back
export const canGoBack = derived(quizStore, ($quiz): boolean => {
  return $quiz.currentQuestion > 1;
});

// Derived store: can go forward (has answered current question)
export const canGoForward = derived(quizStore, ($quiz): boolean => {
  const hasAnswer = $quiz.answers.some(
    (a) => a.questionId === $quiz.currentQuestion
  );
  return hasAnswer && $quiz.currentQuestion < TOTAL_QUESTIONS;
});

// Derived store: has answered all questions
export const isQuizComplete = derived(quizStore, ($quiz): boolean => {
  return $quiz.answers.length >= TOTAL_QUESTIONS;
});
