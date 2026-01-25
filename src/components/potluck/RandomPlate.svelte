<script lang="ts">
  /**
   * RandomPlate - Generates a random selection from each collection category
   * 
   * Uses plateStore to share state with SuggestedBites component.
   * Filters can be applied to influence which items are selected.
   */
  import { onMount } from "svelte";
  import {
    filterState,
    hasActiveFilters,
    initFromURL,
    syncToURL,
  } from "@/stores/filters";
  import { plateStore } from "@/stores/plate";
  import { getRandomFilteredItem } from "@/lib/filters/filter-logic";
  import type { PotluckItem } from "@/lib/filters/types";
  import {
    type PotluckCategory,
    type PlateCategory,
    PLATE_COLLECTION_KEYS,
    COLLECTIONS,
  } from "@/config/collections";
  import PotluckCard from "./PotluckCard.svelte";

  // Props: collections to select from
  export let settings: PotluckItem[];
  export let dishes: PotluckItem[];
  export let desserts: PotluckItem[];
  export let drinks: PotluckItem[];

  // Map prop names to items
  const itemsByKey: Record<PlateCategory, PotluckItem[]> = {
    settings,
    dishes,
    desserts,
    drinks,
  };

  // Category metadata from centralized config
  interface CategoryConfig {
    key: PlateCategory;
    items: PotluckItem[];
    label: string;
    description: string;
  }

  const categories: CategoryConfig[] = PLATE_COLLECTION_KEYS.map((key) => ({
    key,
    items: itemsByKey[key],
    label: COLLECTIONS[key].labelSingular,
    description: COLLECTIONS[key].purpose,
  }));

  // Plate item with match status
  interface PlateItem {
    key: PotluckCategory;
    label: string;
    description: string;
    item: PotluckItem | null;
    isExact: boolean;
  }

  let plate: PlateItem[] = [];
  let isRefreshing = false;

  // Generate a new plate based on current filters
  function generatePlate() {
    const currentFilters = $filterState;
    
    plate = categories.map((cat) => {
      const result = getRandomFilteredItem(cat.items, currentFilters);
      return {
        key: cat.key,
        label: cat.label,
        description: cat.description,
        item: result.item,
        isExact: result.isExact,
      };
    });

    // Update the store with selected items (for SuggestedBites to use)
    const selectedItems = plate
      .map((p) => p.item)
      .filter((item): item is PotluckItem => item !== null);
    plateStore.setItems(selectedItems);
  }

  // Check if any items are approximate matches
  $: hasApproximate = plate.some((p) => p.item && !p.isExact);

  // Initialize on mount
  onMount(() => {
    initFromURL();
    generatePlate();

    // Subscribe to filter changes for URL sync
    const unsubscribe = filterState.subscribe(() => {
      syncToURL();
    });

    return unsubscribe;
  });

  // Regenerate plate when button clicked with animation
  function handleNewPlate() {
    isRefreshing = true;
    plateStore.setRefreshing(true);
    
    setTimeout(() => {
      generatePlate();
      isRefreshing = false;
      plateStore.setRefreshing(false);
    }, 150);
  }
</script>

<div class="plate-actions">
  <button class="button-primary" type="button" on:click={handleNewPlate}>
    Make me a new plate
  </button>
  {#if $hasActiveFilters}
    <p class="filter-status" aria-live="polite">
      {#if hasApproximate}
        Some items are approximate matches (marked with ~)
      {:else}
        All items match your flavor profile
      {/if}
    </p>
  {/if}
</div>

<div class="plate-grid" class:plate-grid--refreshing={isRefreshing}>
  {#each plate as { key, label, description, item, isExact }}
    <div
      class="plate-grid__item"
      class:plate-grid__item--approximate={item && !isExact}
    >
      <div class="plate-grid__category-row">
        <a href="/{key}/" class="category-badge">
          {label}
          {#if item && !isExact}
            <span class="approximate-indicator" title="Closest match to your filters">~</span>
          {/if}
        </a>
        <span class="plate-grid__category-purpose">{description}</span>
      </div>
      {#if item}
        <PotluckCard {item} category={key} />
      {:else}
        <div class="plate-grid__empty">
          <p>No items in this category yet.</p>
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .plate-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-2xl);
  }

  .filter-status {
    font-size: var(--font-size-sm);
    color: var(--text-color-lighter);
    font-style: italic;
    margin: 0;
  }

  .plate-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
    transition:
      opacity 150ms ease-out,
      transform 150ms ease-out;
  }

  .plate-grid--refreshing {
    opacity: 0.5;
    transform: scale(0.98);
  }

  @media (min-width: 768px) {
    .plate-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .plate-grid__item {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .plate-grid__item--approximate {
    opacity: 0.95;
  }

  .plate-grid__category-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    flex-wrap: wrap;
  }

  .plate-grid__category-purpose {
    font-size: var(--font-size-sm);
    color: var(--text-color-lighter);
    font-style: italic;
  }

  .plate-grid__empty {
    padding: var(--spacing-xl);
    background-color: var(--secondary-lightest);
    border-radius: var(--radius-lg);
    text-align: center;
    color: var(--text-color-light);
  }

  /* Category badge */
  .category-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-xs) var(--spacing-md);
    background-color: var(--secondary-lightest);
    color: var(--secondary-dark);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    text-transform: capitalize;
    text-decoration: none;
    transition:
      background-color var(--transition-normal),
      color var(--transition-normal);
  }

  .category-badge:hover {
    background-color: var(--secondary-lighter);
    color: var(--secondary-darkest);
  }

  .category-badge:focus {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .approximate-indicator {
    color: var(--accent);
    font-weight: var(--font-weight-bold);
  }

  /* Button */
  .button-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-semibold);
    color: var(--white);
    background-color: var(--accent);
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition:
      background-color var(--transition-normal),
      transform var(--transition-fast);
  }

  .button-primary:hover {
    background-color: var(--accent-dark);
  }

  .button-primary:focus {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .button-primary:active {
    transform: scale(0.98);
  }
</style>
