/**
 * URL synchronization utilities for filter state
 * Pure functions for parsing and building URL parameters
 */

import type { FilterState, FlavorAxis, FilterRange } from "./types";
import {
  AXIS_KEYS,
  FLAVOR_AXES,
  MIN_FILTER_VALUE,
  MAX_FILTER_VALUE,
} from "./types";
import { isDefaultRange } from "./filter-logic";

/**
 * Parse filter state from URL search parameters
 * Returns a partial state with only the filters found in the URL
 */
export function parseFiltersFromURL(
  searchParams: URLSearchParams,
): Partial<FilterState> {
  const result: Partial<FilterState> = {};

  for (const axis of AXIS_KEYS) {
    const value = searchParams.get(axis);
    if (value) {
      const [min, max] = value.split("-").map(Number);
      if (
        !isNaN(min) &&
        !isNaN(max) &&
        min >= MIN_FILTER_VALUE &&
        max <= MAX_FILTER_VALUE &&
        min <= max
      ) {
        result[axis] = [min, max];
      }
    }
  }

  return result;
}

/**
 * Convert filter state to URL search parameters
 * Only includes filters that the user has explicitly set and are not at default
 */
export function filtersToSearchParams(
  filters: FilterState,
  userSet: Set<FlavorAxis>,
): URLSearchParams {
  const params = new URLSearchParams();

  for (const axis of AXIS_KEYS) {
    if (userSet.has(axis)) {
      const [min, max] = filters[axis];
      // Only add to URL if not at default range
      if (!isDefaultRange([min, max])) {
        params.set(axis, `${min}-${max}`);
      }
    }
  }

  return params;
}

/**
 * Build a complete URL with filter parameters
 */
export function buildFilterURL(
  pathname: string,
  filters: FilterState,
  userSet: Set<FlavorAxis>,
): string {
  const params = filtersToSearchParams(filters, userSet);
  const queryString = params.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}

/**
 * Get a list of active filters with their display information
 * Used for rendering the active filters pills
 */
export function getActiveFiltersFromState(state: FilterState): Array<{
  axis: FlavorAxis;
  label: string;
  minLabel: string;
  maxLabel: string;
  range: FilterRange;
  rangeText: string;
  rangeDescription: string;
}> {
  const activeFilters: Array<{
    axis: FlavorAxis;
    label: string;
    minLabel: string;
    maxLabel: string;
    range: FilterRange;
    rangeText: string;
    rangeDescription: string;
  }> = [];

  for (const axis of AXIS_KEYS) {
    const range = state[axis];
    if (!isDefaultRange(range)) {
      const [min, max] = range;
      const config = FLAVOR_AXES[axis];

      // Create display text for the range
      let rangeText: string;
      if (min === max) {
        rangeText = String(min);
      } else {
        rangeText = `${min}-${max}`;
      }

      // Create accessible description for screen readers
      let rangeDescription: string;
      if (min === max) {
        if (min === MIN_FILTER_VALUE) {
          rangeDescription = `set to ${config.minLabel}`;
        } else if (min === MAX_FILTER_VALUE) {
          rangeDescription = `set to ${config.maxLabel}`;
        } else {
          rangeDescription = `set to ${min}`;
        }
      } else {
        const startDesc =
          min === MIN_FILTER_VALUE
            ? config.minLabel
            : min === MAX_FILTER_VALUE
              ? config.maxLabel
              : String(min);
        const endDesc =
          max === MAX_FILTER_VALUE
            ? config.maxLabel
            : max === MIN_FILTER_VALUE
              ? config.minLabel
              : String(max);
        rangeDescription = `from ${startDesc} to ${endDesc}`;
      }

      activeFilters.push({
        axis,
        label: config.label,
        minLabel: config.minLabel,
        maxLabel: config.maxLabel,
        range,
        rangeText,
        rangeDescription,
      });
    }
  }

  return activeFilters;
}
