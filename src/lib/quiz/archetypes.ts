/**
 * Archetype lookup and filtering functions
 */

import type { Archetype, ArchetypeId } from "@/config/quiz/types";
import { ARCHETYPES } from "@/config/quiz/archetypes";

// Helper to get archetype by slug
export function getArchetypeBySlug(slug: string): Archetype | undefined {
  return Object.values(ARCHETYPES).find((a) => a.slug === slug);
}

// Helper to get archetype by ID
export function getArchetypeById(id: ArchetypeId): Archetype {
  return ARCHETYPES[id];
}

// Get all archetypes as array
export function getAllArchetypes(): Archetype[] {
  return Object.values(ARCHETYPES);
}

// Get archetypes filtered by axis level
export function getArchetypesByAxis(
  axis: "heat" | "sweet" | "zest" | "heft",
  level: "high" | "low"
): Archetype[] {
  return Object.values(ARCHETYPES).filter((a) => a.profile[axis] === level);
}
