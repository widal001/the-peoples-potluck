/**
 * Type definitions for the flavor profile quiz
 * CBC (Choice-Based Conjoint) quiz implementation
 */

// Binary profile level representation
export type ProfileLevel = "high" | "low";

// The four flavor axes
export type FlavorAxis = "heat" | "sweet" | "zest" | "heft";

// Archetype profile - combination of high/low on each axis
export interface ArchetypeProfile {
  heat: ProfileLevel;
  sweet: ProfileLevel;
  zest: ProfileLevel;
  heft: ProfileLevel;
}

/**
 * Unique identifier for each archetype
 * 4-character string: H=High, L=Low
 * Order: Heat, Sweet, Zest, Heft
 * Examples: "HHHH", "LHHL", "LLLL"
 */
export type ArchetypeId =
  | "HHHH"
  | "HHHL"
  | "HHLH"
  | "HHLL"
  | "HLHH"
  | "HLHL"
  | "HLLH"
  | "HLLL"
  | "LHHH"
  | "LHHL"
  | "LHLH"
  | "LHLL"
  | "LLHH"
  | "LLHL"
  | "LLLH"
  | "LLLL";

// Full archetype definition
export interface Archetype {
  id: ArchetypeId;
  slug: string; // URL-friendly: "comfort-food"
  label: string; // Display name: "Comfort Food"
  tagline: string; // One-line description
  description: string; // Full description
  profile: ArchetypeProfile;
  strengths: string[]; // What this profile excels at
  complementaryIds: ArchetypeId[]; // Archetypes that pair well
  suggestedCategories: FlavorAxis[]; // Which axes to filter by for suggestions
}

// Quiz scenario - a concrete organizing activity
export interface Scenario {
  id: string; // Unique ID: "fire-starter-1"
  archetypeId: ArchetypeId;
  title: string; // Short title for the card
  description: string; // Organizing activity description
}

// Quiz question with 4 scenario options
export interface QuizQuestion {
  id: number;
  prompt: string; // "Which approach feels most like you?"
  scenarioIds: [string, string, string, string]; // 4 scenario IDs
}

// Scoring state - counts for each axis level
export interface AxisCounts {
  heat: { high: number; low: number };
  sweet: { high: number; low: number };
  zest: { high: number; low: number };
  heft: { high: number; low: number };
}

// Quiz answer record
export interface QuizAnswer {
  questionId: number;
  scenarioId: string;
  archetypeId: ArchetypeId;
}

// Complete quiz state
export interface QuizState {
  answers: QuizAnswer[];
  currentQuestion: number;
  isComplete: boolean;
  resultId: ArchetypeId | null;
}

// All possible archetype IDs
export const ALL_ARCHETYPE_IDS: ArchetypeId[] = [
  "HHHH",
  "HHHL",
  "HHLH",
  "HHLL",
  "HLHH",
  "HLHL",
  "HLLH",
  "HLLL",
  "LHHH",
  "LHHL",
  "LHLH",
  "LHLL",
  "LLHH",
  "LLHL",
  "LLLH",
  "LLLL",
];
