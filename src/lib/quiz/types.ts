/**
 * Type helper functions for the quiz
 */

import type { ArchetypeId, ArchetypeProfile } from "@/config/quiz/types";

// Helper to convert ArchetypeId to profile
export function idToProfile(id: ArchetypeId): ArchetypeProfile {
  return {
    heat: id[0] === "H" ? "high" : "low",
    sweet: id[1] === "H" ? "high" : "low",
    zest: id[2] === "H" ? "high" : "low",
    heft: id[3] === "H" ? "high" : "low",
  };
}

// Helper to convert profile to ArchetypeId
export function profileToId(profile: ArchetypeProfile): ArchetypeId {
  const h = profile.heat === "high" ? "H" : "L";
  const s = profile.sweet === "high" ? "H" : "L";
  const z = profile.zest === "high" ? "H" : "L";
  const f = profile.heft === "high" ? "H" : "L";
  return `${h}${s}${z}${f}` as ArchetypeId;
}
