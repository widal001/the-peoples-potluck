/**
 * Store for sharing plate state across components
 * Used by RandomPlate and SuggestedBites components
 */

import { writable, derived } from "svelte/store";
import type { PotluckItem } from "@/lib/filters/types";

// The current plate items (one per category)
export interface PlateState {
  items: PotluckItem[];
  isRefreshing: boolean;
}

const initialState: PlateState = {
  items: [],
  isRefreshing: false,
};

// Create the writable store
function createPlateStore() {
  const { subscribe, set, update } = writable<PlateState>(initialState);

  return {
    subscribe,

    // Set the plate items
    setItems: (items: PotluckItem[]) => {
      update((state) => ({ ...state, items }));
    },

    // Set refreshing state (for animations)
    setRefreshing: (isRefreshing: boolean) => {
      update((state) => ({ ...state, isRefreshing }));
    },

    // Reset to initial state
    reset: () => set(initialState),
  };
}

export const plateStore = createPlateStore();

// Derived store: collect all related bite slugs from current plate items
export const relatedBiteSlugs = derived(plateStore, ($plate) => {
  const slugs = new Set<string>();
  for (const item of $plate.items) {
    if (item.relatedBites) {
      for (const slug of item.relatedBites) {
        slugs.add(slug);
      }
    }
  }
  return slugs;
});
