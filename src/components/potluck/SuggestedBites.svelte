<script lang="ts">
  /**
   * SuggestedBites - Displays action items related to current context
   *
   * Two modes:
   * 1. Plate mode (usePlateStore=true): Subscribes to plateStore, shows bites
   *    related to current plate items, updates when plate changes
   * 2. Collection mode (usePlateStore=false): Uses filterStore to show bites
   *    matching current flavor filters
   */
  import { onMount } from "svelte";
  import type { PotluckItem } from "@/lib/filters/types";
  import { resolveSlugsToItems, getRandomFilteredItems } from "@/lib/filters";
  import { COLLECTIONS } from "@/config/collections";
  import { plateStore, relatedBiteSlugs } from "@/stores/plate";
  import { filterState, initFromURL } from "@/stores/filters";
  import PotluckCard from "./PotluckCard.svelte";

  // Props
  export let bites: PotluckItem[];
  export let usePlateStore: boolean = false;
  export let maxItems: number = 3;

  const bitesConfig = COLLECTIONS.bites;

  // Create a lookup map for bites by slug
  const bitesBySlug = new Map(bites.map((b) => [b.slug, b]));

  // Reactive state for displayed bites
  let displayedBites: PotluckItem[] = [];
  let isRefreshing = false;

  // In plate mode, subscribe to plateStore changes
  $: if (usePlateStore) {
    isRefreshing = $plateStore.isRefreshing;
    displayedBites = resolveSlugsToItems($relatedBiteSlugs, bitesBySlug, {
      count: maxItems,
      fallbackPool: bites,
    });
  }

  // In collection mode, subscribe to filterState changes
  $: if (!usePlateStore) {
    displayedBites = getRandomFilteredItems(bites, $filterState, maxItems);
  }

  // Initialize filters from URL on mount (for collection mode)
  onMount(() => {
    if (!usePlateStore) {
      initFromURL();
    }
  });
</script>

{#if displayedBites.length > 0}
  <section
    class="suggested-bites"
    class:suggested-bites--refreshing={isRefreshing}
  >
    <div class="suggested-bites__header">
      <h2 class="suggested-bites__title">
        <a href={bitesConfig.path}>{bitesConfig.label}</a>
      </h2>
      <p class="suggested-bites__tagline">{bitesConfig.tagline}</p>
      <p class="suggested-bites__description">
        Ready to do something? Here are some ways to take action.
      </p>
    </div>

    <div class="suggested-bites__grid" style="--columns: {maxItems}">
      {#each displayedBites as item (item.slug)}
        <PotluckCard {item} category="bites" />
      {/each}
    </div>

    <a href={bitesConfig.path} class="suggested-bites__view-all">
      View all actions →
    </a>
  </section>
{/if}

<style>
  .suggested-bites {
    margin-top: var(--spacing-3xl);
    padding-top: var(--spacing-2xl);
    border-top: var(--border-width) solid var(--border-default);
    transition:
      opacity 150ms ease-out,
      transform 150ms ease-out;
  }

  .suggested-bites--refreshing {
    opacity: 0.5;
    transform: scale(0.98);
  }

  .suggested-bites__header {
    margin-bottom: var(--spacing-xl);
  }

  .suggested-bites__title {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    margin: 0 0 var(--spacing-xs) 0;
  }

  .suggested-bites__title a {
    color: var(--text-color-default);
    text-decoration: none;
    transition: color var(--transition-normal);
  }

  .suggested-bites__title a:hover {
    color: var(--accent);
  }

  .suggested-bites__tagline {
    font-size: var(--font-size-lg);
    font-style: italic;
    color: var(--text-color-lighter);
    margin: 0 0 var(--spacing-xs) 0;
  }

  .suggested-bites__description {
    font-size: var(--font-size-md);
    color: var(--text-color-light);
    margin: 0;
  }

  .suggested-bites__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }

  @media (min-width: 768px) {
    .suggested-bites__grid {
      grid-template-columns: repeat(var(--columns, 3), 1fr);
    }
  }

  .suggested-bites__view-all {
    display: inline-block;
    margin-top: var(--spacing-lg);
    color: var(--accent);
    font-weight: var(--font-weight-medium);
    text-decoration: none;
    transition: color var(--transition-normal);
  }

  .suggested-bites__view-all:hover {
    color: var(--accent-dark);
    text-decoration: underline;
  }
</style>
