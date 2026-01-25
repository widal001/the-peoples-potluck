/**
 * Question lookup and validation functions
 */

import type { QuizQuestion, ArchetypeId } from "@/config/quiz/types";
import { QUESTIONS, DESIGN_MATRIX } from "@/config/quiz/questions";

// Get question by ID (1-indexed)
export function getQuestionById(id: number): QuizQuestion | undefined {
  return QUESTIONS.find((q) => q.id === id);
}

// Total number of questions
export const TOTAL_QUESTIONS = QUESTIONS.length;

/**
 * Verification function to ensure design balance
 * Can be called during development to validate the design
 */
export function verifyDesignBalance(): {
  archetypeCounts: Record<ArchetypeId, number>;
  axisCounts: {
    heat: { high: number; low: number };
    sweet: { high: number; low: number };
    zest: { high: number; low: number };
    heft: { high: number; low: number };
  };
  isBalanced: boolean;
} {
  const archetypeCounts: Record<string, number> = {};
  const axisCounts = {
    heat: { high: 0, low: 0 },
    sweet: { high: 0, low: 0 },
    zest: { high: 0, low: 0 },
    heft: { high: 0, low: 0 },
  };

  for (const row of DESIGN_MATRIX) {
    for (const id of row) {
      archetypeCounts[id] = (archetypeCounts[id] || 0) + 1;

      // Count axis levels based on ID characters
      axisCounts.heat[id[0] === "H" ? "high" : "low"]++;
      axisCounts.sweet[id[1] === "H" ? "high" : "low"]++;
      axisCounts.zest[id[2] === "H" ? "high" : "low"]++;
      axisCounts.heft[id[3] === "H" ? "high" : "low"]++;
    }
  }

  // Check if balanced: each archetype 4 times, each axis level 32 times
  const archetypeBalanced = Object.values(archetypeCounts).every(
    (c) => c === 4
  );
  const axisBalanced =
    axisCounts.heat.high === 32 &&
    axisCounts.heat.low === 32 &&
    axisCounts.sweet.high === 32 &&
    axisCounts.sweet.low === 32 &&
    axisCounts.zest.high === 32 &&
    axisCounts.zest.low === 32 &&
    axisCounts.heft.high === 32 &&
    axisCounts.heft.low === 32;

  return {
    archetypeCounts: archetypeCounts as Record<ArchetypeId, number>,
    axisCounts,
    isBalanced: archetypeBalanced && axisBalanced,
  };
}
