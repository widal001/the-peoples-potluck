/**
 * Pure filtering functions - no side effects, easily testable
 * These functions operate on data and return results without modifying state
 */

import type {
  FilterState,
  FilterRange,
  FlavorProfile,
  FlavorAxis,
  PotluckItem,
} from "./types";
import { DEFAULT_RANGE, AXIS_KEYS } from "./types";

/**
 * Check if a range is at the default (no filtering)
 */
export function isDefaultRange(range: FilterRange): boolean {
  return range[0] === DEFAULT_RANGE[0] && range[1] === DEFAULT_RANGE[1];
}

/**
 * Check if any filter in the state is active (not at default)
 */
export function hasActiveFilters(state: FilterState): boolean {
  return AXIS_KEYS.some((axis) => !isDefaultRange(state[axis]));
}

/**
 * Check if a single item matches the given filters
 * Items without a flavor value for an axis default to the middle value (3)
 */
export function itemMatchesFilters(
  item: PotluckItem,
  filters: FilterState,
): boolean {
  const flavor = item.flavor || {};

  return AXIS_KEYS.every((axis) => {
    const [min, max] = filters[axis];

    // If filter is at default, don't filter on this axis
    if (isDefaultRange([min, max])) return true;

    // Default to middle value (3) if item doesn't have this axis
    const value = flavor[axis] ?? 3;

    return value >= min && value <= max;
  });
}

/**
 * Filter items to only those matching all active filters
 */
export function filterItems(
  items: PotluckItem[],
  filters: FilterState,
): PotluckItem[] {
  return items.filter((item) => itemMatchesFilters(item, filters));
}

/**
 * Calculate the "distance" of an item from the current filter ranges
 * Used for finding closest matches when no exact matches exist
 * Distance of 0 means the item matches all filters
 */
export function getFilterDistance(
  item: PotluckItem,
  filters: FilterState,
): number {
  const flavor = item.flavor || {};
  let distance = 0;

  for (const axis of AXIS_KEYS) {
    const [min, max] = filters[axis];

    // Skip default ranges - they don't contribute to distance
    if (isDefaultRange([min, max])) continue;

    const value = flavor[axis] ?? 3;

    if (value < min) {
      distance += min - value;
    } else if (value > max) {
      distance += value - max;
    }
  }

  return distance;
}

/**
 * Get items sorted by their distance from the filter criteria
 * Items with distance 0 are exact matches
 */
export function getItemsByDistance(
  items: PotluckItem[],
  filters: FilterState,
): Array<{ item: PotluckItem; distance: number }> {
  return items
    .map((item) => ({
      item,
      distance: getFilterDistance(item, filters),
    }))
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Get the closest matching items when no exact matches exist
 * Returns all items tied for the minimum distance
 */
export function getClosestMatches(
  items: PotluckItem[],
  filters: FilterState,
): PotluckItem[] {
  if (items.length === 0) return [];

  const withDistances = getItemsByDistance(items, filters);
  const minDistance = withDistances[0].distance;

  return withDistances
    .filter((d) => d.distance === minDistance)
    .map((d) => d.item);
}

/**
 * Get filtered items, or closest matches if no exact matches exist
 * Returns both the items and whether they are exact matches
 */
export function getFilteredOrClosest(
  items: PotluckItem[],
  filters: FilterState,
): { items: PotluckItem[]; isExact: boolean } {
  const filtered = filterItems(items, filters);

  if (filtered.length > 0) {
    return { items: filtered, isExact: true };
  }

  return { items: getClosestMatches(items, filters), isExact: false };
}

/**
 * Get a random item from an array
 */
export function getRandomItem<T>(arr: T[]): T | null {
  if (arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * Returns a new array, does not mutate the original
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Get N random items from an array
 * Returns up to `count` items, shuffled
 */
export function getRandomItems<T>(items: T[], count: number): T[] {
  return shuffle(items).slice(0, count);
}

/**
 * Get N random items that match the given filters
 * Falls back to closest matches if not enough exact matches exist
 */
export function getRandomFilteredItems(
  items: PotluckItem[],
  filters: FilterState,
  count: number,
): PotluckItem[] {
  const { items: filtered } = getFilteredOrClosest(items, filters);
  return getRandomItems(filtered, count);
}

/**
 * Resolve an array of slugs to items, using a lookup map
 * Optionally fill with random items from a fallback pool if not enough found
 */
export function resolveSlugsToItems(
  slugs: Iterable<string>,
  itemsBySlug: Map<string, PotluckItem>,
  options?: {
    count?: number;
    fallbackPool?: PotluckItem[];
  },
): PotluckItem[] {
  const resolved: PotluckItem[] = [];
  for (const slug of slugs) {
    const item = itemsBySlug.get(slug);
    if (item) resolved.push(item);
  }

  const count = options?.count;
  if (count === undefined) {
    return shuffle(resolved);
  }

  const shuffled = shuffle(resolved).slice(0, count);

  // Fill with random from fallback pool if needed
  if (shuffled.length < count && options?.fallbackPool) {
    const usedSlugs = new Set(shuffled.map((item) => item.slug));
    const remaining = options.fallbackPool.filter(
      (item) => !usedSlugs.has(item.slug),
    );
    const fill = shuffle(remaining).slice(0, count - shuffled.length);
    return [...shuffled, ...fill];
  }

  return shuffled;
}

/**
 * Get a random item from filtered results, with closest-match fallback
 * Used by the plate page for random selection
 */
export function getRandomFilteredItem(
  items: PotluckItem[],
  filters: FilterState,
): { item: PotluckItem | null; isExact: boolean } {
  if (items.length === 0) {
    return { item: null, isExact: true };
  }

  const { items: matchingItems, isExact } = getFilteredOrClosest(
    items,
    filters,
  );

  return {
    item: getRandomItem(matchingItems),
    isExact,
  };
}

// ============================================================================
// Flavor Profile Comparison
// ============================================================================

/**
 * Direction and label for a flavor comparison
 */
export interface FlavorDiff {
  axis: FlavorAxis;
  direction: "up" | "down";
  label: string;
  delta: number;
}

/**
 * Labels for describing flavor differences
 */
const FLAVOR_LABELS: Record<FlavorAxis, { up: string; down: string }> = {
  heat: { up: "Spicier", down: "Milder" },
  sweet: { up: "Sweeter", down: "More bitter" },
  zest: { up: "Bolder", down: "More subtle" },
  heft: { up: "Heavier commitment", down: "Lighter commitment" },
};

/**
 * Compare two flavor profiles and return human-readable differences
 * @param current - The flavor profile of the current item being viewed
 * @param related - The flavor profile of the related item
 * @param threshold - Minimum difference to report (default: 1)
 * @returns Array of significant flavor differences
 */
export function compareFlavorProfiles(
  current: FlavorProfile | undefined,
  related: FlavorProfile | undefined,
  threshold = 1,
): FlavorDiff[] {
  const diffs: FlavorDiff[] = [];

  // Default to middle value (3) for missing values
  const currentFlavor = current || {};
  const relatedFlavor = related || {};

  for (const axis of AXIS_KEYS) {
    const currentValue = currentFlavor[axis] ?? 3;
    const relatedValue = relatedFlavor[axis] ?? 3;
    const delta = relatedValue - currentValue;

    if (Math.abs(delta) >= threshold) {
      const direction = delta > 0 ? "up" : "down";
      diffs.push({
        axis,
        direction,
        label: FLAVOR_LABELS[axis][direction],
        delta: Math.abs(delta),
      });
    }
  }

  return diffs;
}

/**
 * Get a simple summary of how a related item compares to the current item
 * Returns a short string like "Spicier, lighter" or null if similar
 */
export function getFlavorComparisonSummary(
  current: FlavorProfile | undefined,
  related: FlavorProfile | undefined,
  threshold = 1,
): string | null {
  const diffs = compareFlavorProfiles(current, related, threshold);

  if (diffs.length === 0) return null;

  // Take the top 2 most significant differences
  const topDiffs = diffs
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 2)
    .map((d) => d.label.toLowerCase());

  return topDiffs.join(", ");
}

/**
 * Group related items by how they compare to the current item's flavor
 * Useful for displaying "If you want something spicier..." sections
 */
export interface FlavorGroupedItems<T> {
  similar: T[];
  spicier: T[];
  milder: T[];
  bolder: T[];
  lighter: T[];
}

export function groupByFlavorComparison<T extends { flavor?: FlavorProfile }>(
  currentFlavor: FlavorProfile | undefined,
  items: T[],
  threshold = 1,
): FlavorGroupedItems<T> {
  const groups: FlavorGroupedItems<T> = {
    similar: [],
    spicier: [],
    milder: [],
    bolder: [],
    lighter: [],
  };

  for (const item of items) {
    const diffs = compareFlavorProfiles(currentFlavor, item.flavor, threshold);

    if (diffs.length === 0) {
      groups.similar.push(item);
      continue;
    }

    // Find the most significant difference
    const topDiff = diffs.sort((a, b) => b.delta - a.delta)[0];

    switch (topDiff.axis) {
      case "heat":
        if (topDiff.direction === "up") groups.spicier.push(item);
        else groups.milder.push(item);
        break;
      case "heft":
        if (topDiff.direction === "down") groups.lighter.push(item);
        else groups.similar.push(item); // "heavier" isn't as useful a grouping
        break;
      case "zest":
        if (topDiff.direction === "up") groups.bolder.push(item);
        else groups.similar.push(item);
        break;
      default:
        groups.similar.push(item);
    }
  }

  return groups;
}
