/**
 * Filter utilities barrel export
 * Re-exports all types, constants, and functions from the filter modules
 */

// Types and constants
export type {
  FlavorAxis,
  FilterRange,
  FlavorProfile,
  FilterState,
  PotluckIcon,
  PotluckItem,
  PotluckCategory,
  AxisConfig,
} from "./types";

export {
  FLAVOR_AXES,
  AXIS_KEYS,
  MIN_FILTER_VALUE,
  MAX_FILTER_VALUE,
  DEFAULT_RANGE,
  DEFAULT_FILTER_STATE,
} from "./types";

// Pure filtering logic
export {
  isDefaultRange,
  hasActiveFilters,
  itemMatchesFilters,
  filterItems,
  getFilterDistance,
  getItemsByDistance,
  getClosestMatches,
  getFilteredOrClosest,
  getRandomItem,
  getRandomFilteredItem,
  // Flavor comparison
  compareFlavorProfiles,
  getFlavorComparisonSummary,
  groupByFlavorComparison,
} from "./filter-logic";

export type { FlavorDiff, FlavorGroupedItems } from "./filter-logic";

// URL synchronization
export {
  parseFiltersFromURL,
  filtersToSearchParams,
  buildFilterURL,
  getActiveFiltersFromState,
} from "./url-sync";

// Collection utilities
export {
  collectionEntryToItem,
  sortByDateDesc,
  prepareCollectionItems,
} from "./collection-utils";
