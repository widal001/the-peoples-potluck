/**
 * Flavor profile axis configuration
 * Maps flavor axis codes to display labels and metadata
 */

export interface FlavorAxisConfig {
  id: string;
  label: string;
  description: string;
  lowLabel: string;
  highLabel: string;
  min: number;
  max: number;
}

export const FLAVOR_AXIS_KEYS = ["heat", "sweet", "zest", "heft"] as const;

export type FlavorAxisId = (typeof FLAVOR_AXIS_KEYS)[number];

export const FLAVOR_AXES: Record<FlavorAxisId, FlavorAxisConfig> = {
  heat: {
    id: "heat",
    label: "Heat",
    description: "Risk tolerance and intensity",
    lowLabel: "Mild",
    highLabel: "Spicy",
    min: 1,
    max: 5,
  },
  sweet: {
    id: "sweet",
    label: "Sweet",
    description: "Emotional register and motivation",
    lowLabel: "Bitter",
    highLabel: "Sweet",
    min: 1,
    max: 5,
  },
  zest: {
    id: "zest",
    label: "Zest",
    description: "Visibility and presence",
    lowLabel: "Subtle",
    highLabel: "Bold",
    min: 1,
    max: 5,
  },
  heft: {
    id: "heft",
    label: "Heft",
    description: "Time commitment required",
    lowLabel: "Light",
    highLabel: "Hearty",
    min: 1,
    max: 5,
  },
};

/**
 * Get flavor axis config by ID
 */
export function getFlavorAxisConfig(axisId: FlavorAxisId): FlavorAxisConfig {
  return FLAVOR_AXES[axisId];
}

/**
 * Get all flavor axes
 */
export function getAllFlavorAxes(): FlavorAxisConfig[] {
  return FLAVOR_AXIS_KEYS.map((key) => FLAVOR_AXES[key]);
}

/**
 * Check if a flavor axis ID is valid
 */
export function isValidFlavorAxisId(id: string): id is FlavorAxisId {
  return FLAVOR_AXIS_KEYS.includes(id as FlavorAxisId);
}

/**
 * Validate a flavor value is within range
 */
export function isValidFlavorValue(
  axisId: FlavorAxisId,
  value: number,
): boolean {
  const axis = FLAVOR_AXES[axisId];
  return value >= axis.min && value <= axis.max;
}

/**
 * Flavor profile type for items
 */
export interface FlavorProfile {
  heat: number | null;
  sweet: number | null;
  zest: number | null;
  heft: number | null;
}

/**
 * Enriched flavor value with axis metadata
 */
export interface EnrichedFlavorValue {
  value: number | null;
  axis: FlavorAxisConfig;
}

/**
 * Enriched flavor profile with axis metadata
 */
export interface EnrichedFlavorProfile {
  heat: EnrichedFlavorValue;
  sweet: EnrichedFlavorValue;
  zest: EnrichedFlavorValue;
  heft: EnrichedFlavorValue;
}

/**
 * Enrich a flavor profile with axis metadata
 */
export function enrichFlavorProfile(
  profile: FlavorProfile,
): EnrichedFlavorProfile {
  return {
    heat: { value: profile.heat, axis: FLAVOR_AXES.heat },
    sweet: { value: profile.sweet, axis: FLAVOR_AXES.sweet },
    zest: { value: profile.zest, axis: FLAVOR_AXES.zest },
    heft: { value: profile.heft, axis: FLAVOR_AXES.heft },
  };
}
