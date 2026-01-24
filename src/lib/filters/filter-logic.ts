/**
 * Pure filtering functions - no side effects, easily testable
 * These functions operate on data and return results without modifying state
 */

import type { FilterState, FilterRange, PotluckItem } from "./types";
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
