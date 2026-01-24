/**
 * Filter state management using nanostores
 * Works natively with Svelte's $ syntax
 */

import { atom, computed } from "nanostores";
import type { FilterState, FlavorAxis, FilterRange } from "@/lib/filters/types";
import {
  DEFAULT_FILTER_STATE,
  DEFAULT_RANGE,
  FLAVOR_AXES,
  AXIS_KEYS,
} from "@/lib/filters/types";
import { hasActiveFilters as checkHasActiveFilters } from "@/lib/filters/filter-logic";
import {
  parseFiltersFromURL,
  filtersToSearchParams,
} from "@/lib/filters/url-sync";

// Re-export types and constants for convenience
export { FLAVOR_AXES, AXIS_KEYS, DEFAULT_FILTER_STATE, DEFAULT_RANGE };
export type { FlavorAxis, FilterRange, FilterState };

// Main filter state - single atom for the entire filter state
export const filterState = atom<FilterState>({
  heat: [...DEFAULT_RANGE] as FilterRange,
  sweet: [...DEFAULT_RANGE] as FilterRange,
  zest: [...DEFAULT_RANGE] as FilterRange,
  heft: [...DEFAULT_RANGE] as FilterRange,
});

// Track which filters user has explicitly set (for URL persistence)
export const userSetFilters = atom<Set<FlavorAxis>>(new Set());

// Derived: whether any filters are active
export const hasActiveFilters = computed(filterState, checkHasActiveFilters);

/**
 * Set a filter value for a specific axis and mark it as user-set
 */
export function setFilter(axis: FlavorAxis, range: FilterRange): void {
  const current = filterState.get();
  filterState.set({ ...current, [axis]: [...range] as FilterRange });

  const userSet = userSetFilters.get();
  userSet.add(axis);
  userSetFilters.set(new Set(userSet));
}

/**
 * Reset a single filter to default
 */
export function resetFilter(axis: FlavorAxis): void {
  const current = filterState.get();
  filterState.set({ ...current, [axis]: [...DEFAULT_RANGE] as FilterRange });

  const userSet = userSetFilters.get();
  userSet.delete(axis);
  userSetFilters.set(new Set(userSet));
}

/**
 * Reset all filters to default
 */
export function resetAllFilters(): void {
  filterState.set({
    heat: [...DEFAULT_RANGE] as FilterRange,
    sweet: [...DEFAULT_RANGE] as FilterRange,
    zest: [...DEFAULT_RANGE] as FilterRange,
    heft: [...DEFAULT_RANGE] as FilterRange,
  });
  userSetFilters.set(new Set());
}

/**
 * Initialize filter state from URL parameters
 * Call on page mount
 */
export function initFromURL(): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const parsed = parseFiltersFromURL(params);

  if (Object.keys(parsed).length > 0) {
    const current = filterState.get();
    const newState = { ...current };
    const userSet = new Set<FlavorAxis>();

    for (const axis of AXIS_KEYS) {
      if (parsed[axis]) {
        newState[axis] = parsed[axis] as FilterRange;
        userSet.add(axis);
      }
    }

    filterState.set(newState);
    userSetFilters.set(userSet);
  }
}

/**
 * Sync current filter state to URL
 * Call after filter changes
 */
export function syncToURL(): void {
  if (typeof window === "undefined") return;

  const filters = filterState.get();
  const userSet = userSetFilters.get();
  const params = filtersToSearchParams(filters, userSet);

  const newURL = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;

  window.history.replaceState({}, "", newURL);
}
