/**
 * 16 Balanced CBC Questions
 *
 * Design ensures:
 * - Each archetype appears exactly 4 times
 * - Each axis level (high/low) appears 32 times total
 * - Maximum contrast between options in each question
 * - Scenarios alternate (A for appearances 1,3; B for appearances 2,4)
 */

import type { QuizQuestion, ArchetypeId } from "./types";
import { SCENARIOS_BY_ARCHETYPE } from "./scenarios";

// The balanced design matrix
// Each question has 4 archetypes that provide good contrast
export const DESIGN_MATRIX: ArchetypeId[][] = [
  // Q1-Q4: Maximum contrast pairs
  ["HHHH", "LLLL", "HLHL", "LHLH"],
  ["HHHL", "LLLH", "HLHH", "LHLL"],
  ["HHLH", "LLHL", "HLLH", "LHHL"],
  ["HHLL", "LLHH", "HLLL", "LHHH"],

  // Q5-Q8: Heat-focused contrast (high heat vs low heat)
  ["HHHH", "HHHL", "LLHH", "LLHL"],
  ["HHLH", "HHLL", "LLLH", "LLLL"],
  ["HLHH", "HLHL", "LHHH", "LHHL"],
  ["HLLH", "HLLL", "LHLH", "LHLL"],

  // Q9-Q12: Sweet-focused contrast
  ["HHHH", "HHLH", "LHHL", "LHLL"],
  ["HHHL", "HHLL", "LHHH", "LHLH"],
  ["HLHH", "HLLH", "LLHL", "LLLL"],
  ["HLHL", "HLLL", "LLHH", "LLLH"],

  // Q13-Q16: Zest and Heft focused contrast
  ["HHHH", "HLHH", "LHLH", "LLHL"],
  ["HHHL", "HLHL", "LHLL", "LLLH"],
  ["HHLH", "HLLH", "LHHH", "LLHH"],
  ["HHLL", "HLLL", "LHHL", "LLLL"],
];

// Question prompts that frame the choice
export const QUESTION_PROMPTS: string[] = [
  "Your community is organizing a response to increased enforcement. Which role calls to you?",
  "A neighbor asks how they can help immigrant families. What do you suggest they try?",
  "You have time to contribute this month. What feels most meaningful?",
  "An organization is recruiting volunteers. Which opportunity interests you?",
  "You're thinking about how to make a difference. What approach resonates?",
  "A local group needs more people involved. What would you want to do?",
  "You want to support immigrant communities. Which way feels right?",
  "There's momentum building in your neighborhood. How do you want to join in?",
  "You're deciding how to spend your activist energy. What draws you?",
  "A friend invites you to get involved. Which option appeals to you?",
  "You're looking for ways to contribute. What matches your style?",
  "The community is mobilizing. Where do you see yourself?",
  "You want to take action but aren't sure how. What feels authentic?",
  "There are many ways to help. Which one speaks to you?",
  "You're ready to do something. What kind of engagement fits?",
  "It's time to step up. Which approach matches your strengths?",
];

// Build questions with proper scenario rotation
// Each archetype's scenarios alternate: A, B, A, B for appearances 1, 2, 3, 4
function buildQuestions(): QuizQuestion[] {
  const tracker: Record<ArchetypeId, number> = {
    HHHH: 0,
    HHHL: 0,
    HHLH: 0,
    HHLL: 0,
    HLHH: 0,
    HLHL: 0,
    HLLH: 0,
    HLLL: 0,
    LHHH: 0,
    LHHL: 0,
    LHLH: 0,
    LHLL: 0,
    LLHH: 0,
    LLHL: 0,
    LLLH: 0,
    LLLL: 0,
  };

  return DESIGN_MATRIX.map((archetypeIds, index) => {
    const scenarioIds = archetypeIds.map((archetypeId) => {
      const appearanceCount = tracker[archetypeId];
      const scenarioIndex = (appearanceCount % 2) as 0 | 1;
      tracker[archetypeId]++;

      return SCENARIOS_BY_ARCHETYPE[archetypeId][scenarioIndex].id;
    }) as [string, string, string, string];

    return {
      id: index + 1,
      prompt: QUESTION_PROMPTS[index],
      scenarioIds,
    };
  });
}

// The built questions (computed once at module load)
export const QUESTIONS: QuizQuestion[] = buildQuestions();
