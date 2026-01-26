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
  let isLocalShuffling = false;
  let localShuffleTimeout: ReturnType<typeof setTimeout> | null = null;

  // Counter to force re-computation when shuffle is clicked
  let shuffleCounter = 0;

  // In plate mode, subscribe to plateStore changes and shuffleCounter
  $: if (usePlateStore) {
    // Reference shuffleCounter to trigger reactivity on shuffle
    shuffleCounter;
    
    // Compute new bites
    const newBites = resolveSlugsToItems($relatedBiteSlugs, bitesBySlug, {
      count: maxItems,
      fallbackPool: bites,
    });
    
    // Update displayedBites
    displayedBites = newBites.length > 0 ? newBites : displayedBites;
  }

  // Separate reactive statement for syncing refreshing state from plateStore
  $: if (usePlateStore && !isLocalShuffling) {
    isRefreshing = $plateStore.isRefreshing;
  }

  // In collection mode, subscribe to filterState changes and shuffleCounter
  $: if (!usePlateStore) {
    // Reference shuffleCounter to trigger reactivity on shuffle
    shuffleCounter;
    displayedBites = getRandomFilteredItems(bites, $filterState, maxItems);
  }

  // Handle shuffle button click
  function handleShuffle() {
    // Clear any existing timeout
    if (localShuffleTimeout) {
      clearTimeout(localShuffleTimeout);
    }
    
    isLocalShuffling = true;
    isRefreshing = true;
    localShuffleTimeout = setTimeout(() => {
      shuffleCounter++;
      isRefreshing = false;
      // Reset local shuffling flag after a brief delay to allow plate store to sync
      setTimeout(() => {
        isLocalShuffling = false;
        localShuffleTimeout = null;
      }, 50);
    }, 150);
  }

  // Initialize filters from URL on mount (for collection mode)
  onMount(() => {
    if (!usePlateStore) {
      initFromURL();
    }
  });
</script>

{#if displayedBites.length > 0}
  <section class="suggested-bites">
    <div class="suggested-bites__header">
      <h2 class="suggested-bites__title">
        <a href={bitesConfig.path}>{bitesConfig.label}</a>
      </h2>
      <p class="suggested-bites__tagline">{bitesConfig.tagline}</p>
      <p class="suggested-bites__description">
        Ready to do something? Here are some ways to take action.
      </p>
    </div>

    <div
      class="suggested-bites__grid"
      class:suggested-bites__grid--refreshing={isRefreshing}
      style="--columns: {maxItems}"
    >
      {#each displayedBites as item (item.slug)}
        <PotluckCard {item} category="bites" compact={true} />
      {/each}
    </div>

    <div class="suggested-bites__footer">
      <button
        class="suggested-bites__shuffle"
        type="button"
        on:click={handleShuffle}
      >
        Shuffle suggestions
      </button>
      <a href={bitesConfig.path} class="suggested-bites__view-all">
        View all actions →
      </a>
    </div>
  </section>
{/if}

<style>
  .suggested-bites {
    margin-top: var(--spacing-3xl);
    padding-top: var(--spacing-2xl);
    border-top: var(--border-width) solid var(--border-default);
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
    transition:
      opacity 150ms ease-out,
      transform 150ms ease-out;
  }

  .suggested-bites__grid--refreshing {
    opacity: 0.5;
    transform: scale(0.98);
  }

  @media (min-width: 768px) {
    .suggested-bites__grid {
      grid-template-columns: repeat(var(--columns, 3), 1fr);
    }
  }

  .suggested-bites__footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-md);
    margin-top: var(--spacing-lg);
  }

  .suggested-bites__shuffle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--accent);
    background-color: transparent;
    border: 1px solid var(--accent);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition:
      background-color var(--transition-normal),
      color var(--transition-normal),
      transform var(--transition-fast);
  }

  .suggested-bites__shuffle:hover {
    background-color: var(--accent);
    color: var(--white);
  }

  .suggested-bites__shuffle:focus {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .suggested-bites__shuffle:active {
    transform: scale(0.98);
  }

  .suggested-bites__view-all {
    display: inline-block;
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
