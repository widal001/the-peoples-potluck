/**
 * Quiz logic exports
 * Re-exports all functions from the quiz lib modules
 */

// Type helpers
export { idToProfile, profileToId } from "./types";

// Archetype functions
export {
  getArchetypeById,
  getArchetypeBySlug,
  getAllArchetypes,
  getArchetypesByAxis,
} from "./archetypes";

// Scenario functions
export {
  getScenarioById,
  getScenariosByArchetype,
  getScenarioForArchetype,
} from "./scenarios";

// Question functions
export { getQuestionById, TOTAL_QUESTIONS, verifyDesignBalance } from "./questions";

// Scoring functions
export {
  createEmptyAxisCounts,
  addToAxisCounts,
  calculateAxisCounts,
  calculateResult,
  calculateProfile,
  getConfidenceScores,
  getConfidenceDescription,
  getOverallConfidence,
  getTiedAxes,
  isAxisTied,
} from "./scoring";
