import { atom, computed } from "nanostores";

// Types for flavor profile filtering
export type FlavorAxis = "heat" | "sweet" | "zest" | "heft";
export type FilterRange = [number, number]; // [min, max] on 1-5 scale

// Default range includes all values (no filtering)
const DEFAULT_RANGE: FilterRange = [1, 5];

// Axis metadata for UI labels
export const FLAVOR_AXES: Record<
  FlavorAxis,
  { label: string; minLabel: string; maxLabel: string }
> = {
  heat: { label: "Heat", minLabel: "mild", maxLabel: "spicy" },
  sweet: { label: "Sweet", minLabel: "bitter", maxLabel: "sweet" },
  zest: { label: "Zest", minLabel: "subtle", maxLabel: "bold" },
  heft: { label: "Heft", minLabel: "light", maxLabel: "hearty" },
};

// Individual filter atoms for each axis
export const heatFilter = atom<FilterRange>([...DEFAULT_RANGE]);
export const sweetFilter = atom<FilterRange>([...DEFAULT_RANGE]);
export const zestFilter = atom<FilterRange>([...DEFAULT_RANGE]);
export const heftFilter = atom<FilterRange>([...DEFAULT_RANGE]);

// Map of axis to its atom for programmatic access
export const filterAtoms: Record<FlavorAxis, typeof heatFilter> = {
  heat: heatFilter,
  sweet: sweetFilter,
  zest: zestFilter,
  heft: heftFilter,
};

// Track which filters have been explicitly set by the user
// (used to determine whether to include in URL)
export const userSetFilters = atom<Set<FlavorAxis>>(new Set());

// Computed store: all filters combined
export const allFilters = computed(
  [heatFilter, sweetFilter, zestFilter, heftFilter],
  (heat, sweet, zest, heft) => ({
    heat,
    sweet,
    zest,
    heft,
  }),
);

// Computed store: check if any filter is active (not at default range)
export const hasActiveFilters = computed(
  [heatFilter, sweetFilter, zestFilter, heftFilter],
  (heat, sweet, zest, heft) => {
    const isDefault = (range: FilterRange) =>
      range[0] === DEFAULT_RANGE[0] && range[1] === DEFAULT_RANGE[1];
    return (
      !isDefault(heat) ||
      !isDefault(sweet) ||
      !isDefault(zest) ||
      !isDefault(heft)
    );
  },
);

// Set a filter value and mark it as user-set
export function setFilter(axis: FlavorAxis, range: FilterRange): void {
  filterAtoms[axis].set([...range]);
  const current = userSetFilters.get();
  current.add(axis);
  userSetFilters.set(new Set(current));
}

// Reset a single filter to default
export function resetFilter(axis: FlavorAxis): void {
  filterAtoms[axis].set([...DEFAULT_RANGE]);
  const current = userSetFilters.get();
  current.delete(axis);
  userSetFilters.set(new Set(current));
}

// Reset all filters to default
export function resetAllFilters(): void {
  heatFilter.set([...DEFAULT_RANGE]);
  sweetFilter.set([...DEFAULT_RANGE]);
  zestFilter.set([...DEFAULT_RANGE]);
  heftFilter.set([...DEFAULT_RANGE]);
  userSetFilters.set(new Set());
}

// URL sync utilities
const AXIS_KEYS: FlavorAxis[] = ["heat", "sweet", "zest", "heft"];

// Parse URL params and set filters (call on page load)
export function loadFiltersFromURL(): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);

  for (const axis of AXIS_KEYS) {
    const value = params.get(axis);
    if (value) {
      const [min, max] = value.split("-").map(Number);
      if (!isNaN(min) && !isNaN(max) && min >= 1 && max <= 5 && min <= max) {
        filterAtoms[axis].set([min, max]);
        const current = userSetFilters.get();
        current.add(axis);
        userSetFilters.set(new Set(current));
      }
    }
  }
}

// Update URL params based on current filters (only user-set ones)
export function syncFiltersToURL(): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const userSet = userSetFilters.get();

  for (const axis of AXIS_KEYS) {
    if (userSet.has(axis)) {
      const [min, max] = filterAtoms[axis].get();
      // Only add to URL if not at default range
      if (min !== DEFAULT_RANGE[0] || max !== DEFAULT_RANGE[1]) {
        params.set(axis, `${min}-${max}`);
      } else {
        params.delete(axis);
      }
    } else {
      params.delete(axis);
    }
  }

  const newURL = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;

  window.history.replaceState({}, "", newURL);
}
