/**
 * Scenario lookup functions
 */

import type { Scenario, ArchetypeId } from "@/config/quiz/types";
import { SCENARIOS, SCENARIOS_BY_ARCHETYPE } from "@/config/quiz/scenarios";

// Get scenario by ID
export function getScenarioById(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

// Get scenarios by archetype ID
export function getScenariosByArchetype(archetypeId: ArchetypeId): Scenario[] {
  return SCENARIOS_BY_ARCHETYPE[archetypeId] || [];
}

// Get scenario at specific index for an archetype (0 or 1)
export function getScenarioForArchetype(
  archetypeId: ArchetypeId,
  index: 0 | 1,
): Scenario {
  return SCENARIOS_BY_ARCHETYPE[archetypeId][index];
}
