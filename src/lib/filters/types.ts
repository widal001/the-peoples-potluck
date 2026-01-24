/**
 * Shared types for flavor profile filtering
 * These types are used by pure logic, stores, and UI components
 */

// The four flavor axes
export type FlavorAxis = "heat" | "sweet" | "zest" | "heft";

// A filter range is a tuple of [min, max] on a 1-5 scale
export type FilterRange = [number, number];

// Flavor profile values for an item
export interface FlavorProfile {
  heat?: number;
  sweet?: number;
  zest?: number;
  heft?: number;
}

// Complete filter state for all axes
export interface FilterState {
  heat: FilterRange;
  sweet: FilterRange;
  zest: FilterRange;
  heft: FilterRange;
}

// Icon data structure
export interface PotluckIcon {
  svg: string;
  primaryColor: string;
  secondaryColor: string;
}

// A potluck item with all its data
export interface PotluckItem {
  slug: string;
  title: string;
  description: string;
  tags?: string[];
  icon?: PotluckIcon;
  flavor?: FlavorProfile;
}

// Category types
export type PotluckCategory =
  | "side-dishes"
  | "desserts"
  | "plates-cutlery"
  | "drinks";

// Axis metadata for UI display
export interface AxisConfig {
  label: string;
  minLabel: string;
  maxLabel: string;
}

// Metadata for all flavor axes
export const FLAVOR_AXES: Record<FlavorAxis, AxisConfig> = {
  heat: { label: "Heat", minLabel: "mild", maxLabel: "spicy" },
  sweet: { label: "Sweet", minLabel: "bitter", maxLabel: "sweet" },
  zest: { label: "Zest", minLabel: "subtle", maxLabel: "bold" },
  heft: { label: "Heft", minLabel: "light", maxLabel: "hearty" },
};

// List of all axis keys for iteration
export const AXIS_KEYS: FlavorAxis[] = ["heat", "sweet", "zest", "heft"];

// Filter scale boundaries (1-5 scale)
export const MIN_FILTER_VALUE = 1;
export const MAX_FILTER_VALUE = 5;

// Default range includes all values (no filtering)
export const DEFAULT_RANGE: FilterRange = [MIN_FILTER_VALUE, MAX_FILTER_VALUE];

// Default filter state with all ranges at default
export const DEFAULT_FILTER_STATE: FilterState = {
  heat: [...DEFAULT_RANGE] as FilterRange,
  sweet: [...DEFAULT_RANGE] as FilterRange,
  zest: [...DEFAULT_RANGE] as FilterRange,
  heft: [...DEFAULT_RANGE] as FilterRange,
};
