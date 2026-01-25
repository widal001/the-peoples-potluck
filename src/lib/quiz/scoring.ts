/**
 * CBC Count-Based Scoring Algorithm
 *
 * For each question answered:
 * - Increment counts for each axis based on chosen profile
 *
 * After all questions:
 * - For each axis, high wins if high_count > low_count
 * - Map resulting 4-bit profile to archetype
 *
 * Tie-breaking: Most recent choice breaks ties
 */

import type {
  ArchetypeId,
  ArchetypeProfile,
  AxisCounts,
  QuizAnswer,
  ProfileLevel,
  FlavorAxis,
} from "@/config/quiz/types";
import { idToProfile, profileToId } from "./types";

// Initialize empty axis counts
export function createEmptyAxisCounts(): AxisCounts {
  return {
    heat: { high: 0, low: 0 },
    sweet: { high: 0, low: 0 },
    zest: { high: 0, low: 0 },
    heft: { high: 0, low: 0 },
  };
}

// Add an archetype's profile to the counts
export function addToAxisCounts(
  counts: AxisCounts,
  archetypeId: ArchetypeId
): AxisCounts {
  const profile = idToProfile(archetypeId);

  return {
    heat: {
      high: counts.heat.high + (profile.heat === "high" ? 1 : 0),
      low: counts.heat.low + (profile.heat === "low" ? 1 : 0),
    },
    sweet: {
      high: counts.sweet.high + (profile.sweet === "high" ? 1 : 0),
      low: counts.sweet.low + (profile.sweet === "low" ? 1 : 0),
    },
    zest: {
      high: counts.zest.high + (profile.zest === "high" ? 1 : 0),
      low: counts.zest.low + (profile.zest === "low" ? 1 : 0),
    },
    heft: {
      high: counts.heft.high + (profile.heft === "high" ? 1 : 0),
      low: counts.heft.low + (profile.heft === "low" ? 1 : 0),
    },
  };
}

// Calculate axis counts from a list of answers
export function calculateAxisCounts(answers: QuizAnswer[]): AxisCounts {
  let counts = createEmptyAxisCounts();

  for (const answer of answers) {
    counts = addToAxisCounts(counts, answer.archetypeId);
  }

  return counts;
}

// Check if an axis is tied
export function isAxisTied(counts: AxisCounts, axis: FlavorAxis): boolean {
  return counts[axis].high === counts[axis].low;
}

// Get all tied axes
export function getTiedAxes(counts: AxisCounts): FlavorAxis[] {
  const axes: FlavorAxis[] = ["heat", "sweet", "zest", "heft"];
  return axes.filter((axis) => isAxisTied(counts, axis));
}

// Determine winner for an axis (with optional tiebreaker)
export function getAxisWinner(
  counts: AxisCounts,
  axis: FlavorAxis,
  tiebreaker?: ProfileLevel
): ProfileLevel {
  if (counts[axis].high > counts[axis].low) {
    return "high";
  } else if (counts[axis].low > counts[axis].high) {
    return "low";
  } else {
    // Tie - use tiebreaker or default to "high"
    return tiebreaker ?? "high";
  }
}

// Get tiebreaker values from most recent answer that has non-tied values
export function getTiebreakersFromAnswers(
  answers: QuizAnswer[],
  tiedAxes: FlavorAxis[]
): Partial<Record<FlavorAxis, ProfileLevel>> {
  const tiebreakers: Partial<Record<FlavorAxis, ProfileLevel>> = {};

  // Go through answers in reverse (most recent first)
  for (let i = answers.length - 1; i >= 0; i--) {
    const profile = idToProfile(answers[i].archetypeId);

    for (const axis of tiedAxes) {
      if (!(axis in tiebreakers)) {
        tiebreakers[axis] = profile[axis];
      }
    }

    // Stop if we've found tiebreakers for all tied axes
    if (Object.keys(tiebreakers).length === tiedAxes.length) {
      break;
    }
  }

  return tiebreakers;
}

// Calculate final profile from counts
export function calculateProfile(
  counts: AxisCounts,
  tiebreakers?: Partial<Record<FlavorAxis, ProfileLevel>>
): ArchetypeProfile {
  return {
    heat: getAxisWinner(counts, "heat", tiebreakers?.heat),
    sweet: getAxisWinner(counts, "sweet", tiebreakers?.sweet),
    zest: getAxisWinner(counts, "zest", tiebreakers?.zest),
    heft: getAxisWinner(counts, "heft", tiebreakers?.heft),
  };
}

// Main scoring function: answers -> archetype ID
export function calculateResult(answers: QuizAnswer[]): ArchetypeId {
  const counts = calculateAxisCounts(answers);
  const tiedAxes = getTiedAxes(counts);

  let tiebreakers: Partial<Record<FlavorAxis, ProfileLevel>> | undefined;
  if (tiedAxes.length > 0) {
    tiebreakers = getTiebreakersFromAnswers(answers, tiedAxes);
  }

  const profile = calculateProfile(counts, tiebreakers);
  return profileToId(profile);
}

// Get confidence scores (how strongly each axis leaned)
export function getConfidenceScores(
  counts: AxisCounts
): Record<FlavorAxis, number> {
  const total = counts.heat.high + counts.heat.low; // Should be same for all axes

  return {
    heat: total > 0 ? Math.abs(counts.heat.high - counts.heat.low) / total : 0,
    sweet:
      total > 0 ? Math.abs(counts.sweet.high - counts.sweet.low) / total : 0,
    zest: total > 0 ? Math.abs(counts.zest.high - counts.zest.low) / total : 0,
    heft: total > 0 ? Math.abs(counts.heft.high - counts.heft.low) / total : 0,
  };
}

// Get human-readable confidence description
export function getConfidenceDescription(score: number): string {
  if (score >= 0.75) return "very strong";
  if (score >= 0.5) return "strong";
  if (score >= 0.25) return "moderate";
  return "slight";
}

// Calculate overall match strength (average confidence)
export function getOverallConfidence(counts: AxisCounts): number {
  const scores = getConfidenceScores(counts);
  return (scores.heat + scores.sweet + scores.zest + scores.heft) / 4;
}
