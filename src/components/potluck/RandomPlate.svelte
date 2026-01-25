<script lang="ts">
  import { onMount } from "svelte";
  import {
    filterState,
    hasActiveFilters,
    initFromURL,
    syncToURL,
  } from "@/stores/filters";
  import { getRandomFilteredItem } from "@/lib/filters/filter-logic";
  import type { PotluckItem } from "@/lib/filters/types";
  import {
    type PotluckCategory,
    COLLECTION_KEYS,
    COLLECTIONS,
  } from "@/config/collections";
  import PotluckCard from "./PotluckCard.svelte";

  export let settings: PotluckItem[];
  export let dishes: PotluckItem[];
  export let desserts: PotluckItem[];
  export let drinks: PotluckItem[];
  export let bites: PotluckItem[];

  // Map prop names to items
  const itemsByKey: Record<PotluckCategory, PotluckItem[]> = {
    settings,
    dishes,
    desserts,
    drinks,
    bites,
  };

  // Category metadata from centralized config
  interface CategoryConfig {
    key: PotluckCategory;
    items: PotluckItem[];
    label: string;
    description: string;
  }

  // Build categories from centralized config
  const categories: CategoryConfig[] = COLLECTION_KEYS.map((key) => ({
    key,
    items: itemsByKey[key],
    label: COLLECTIONS[key].labelSingular,
    description: COLLECTIONS[key].purpose,
  }));

  // Current plate state
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
  }

  // Check if any items are approximate matches
  $: hasApproximate = plate.some((p) => p.item && !p.isExact);

  // Initialize on mount
  onMount(() => {
    initFromURL();

    // Generate initial plate
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
    // Wait for fade out, then update and fade back in
    setTimeout(() => {
      generatePlate();
      isRefreshing = false;
    }, 150);
  }
</script>

<div class="plate-actions">
  <button class="button-primary" type="button" on:click={handleNewPlate}>
    Make me a new plate
  </button>
  {#if $hasActiveFilters}
    <p class="filter-status filter-status--visible" aria-live="polite">
      {#if hasApproximate}
        Some items are approximate matches (marked with ~)
      {:else}
        All items match your flavor profile
      {/if}
    </p>
  {/if}
</div>

<div class="plate-display" class:plate-display--refreshing={isRefreshing}>
  {#each plate as { key, label, description, item, isExact }}
    <div
      class="plate-display__item"
      class:plate-display__item--approximate={item && !isExact}
    >
      <div class="plate-display__category-row">
        <a href="/{key}/" class="category-badge category-badge--link">
          {label}
          {#if item && !isExact}
            <span class="approximate-indicator" title="Closest match to your filters">~</span>
          {/if}
        </a>
        <span class="plate-display__category-description">{description}</span>
      </div>
      {#if item}
        <PotluckCard {item} category={key} />
      {:else}
        <div class="plate-display__empty">
          <p class="text-body-large">No items in this category yet.</p>
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

  .plate-display {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-xl);
    transition:
      opacity 150ms ease-out,
      transform 150ms ease-out;
  }

  .plate-display--refreshing {
    opacity: 0.5;
    transform: scale(0.98);
  }

  @media (min-width: 768px) {
    .plate-display {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .plate-display__item {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .plate-display__item--approximate {
    /* Subtle visual indicator for approximate matches */
    opacity: 0.95;
  }

  .plate-display__category-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    flex-wrap: wrap;
  }

  .plate-display__category-description {
    font-size: var(--font-size-sm);
    color: var(--text-color-lighter);
    font-style: italic;
  }

  .plate-display__empty {
    padding: var(--spacing-xl);
    background-color: var(--secondary-lightest);
    border-radius: var(--radius-lg);
    text-align: center;
  }

  /* Category badge styles */
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
  }

  .category-badge--link {
    text-decoration: none;
    transition:
      background-color var(--transition-normal),
      color var(--transition-normal);
  }

  .category-badge--link:hover {
    background-color: var(--secondary-lighter);
    color: var(--secondary-darkest);
  }

  .category-badge--link:focus {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .approximate-indicator {
    color: var(--accent);
    font-weight: var(--font-weight-bold);
  }

  /* Button styles */
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

  .text-body-large {
    font-size: var(--font-size-lg);
    line-height: 1.6;
    color: var(--text-color-default);
  }
</style>
