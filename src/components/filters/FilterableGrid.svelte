<script lang="ts">
  import { onMount } from "svelte";
  import { filterState, initFromURL, syncToURL } from "@/stores/filters";
  import { filterItems } from "@/lib/filters/filter-logic";
  import type { PotluckItem, PotluckCategory } from "@/lib/filters/types";
  import PotluckCard from "@/components/potluck/PotluckCard.svelte";

  export let items: PotluckItem[];
  export let category: PotluckCategory;
  export let emptyMessage: string = "No items yet. Check back soon!";

  // Initialize from URL on mount, sync changes back
  onMount(() => {
    initFromURL();
    // Subscribe to filter changes and sync to URL
    const unsubscribe = filterState.subscribe(() => {
      syncToURL();
    });
    return unsubscribe;
  });

  // Reactive filtering - recalculates when $filterState changes
  $: filteredItems = filterItems(items, $filterState);
</script>

{#if filteredItems.length > 0}
  <ul class="potluck-grid">
    {#each filteredItems as item (item.slug)}
      <li class="potluck-grid__item">
        <PotluckCard {item} {category} />
      </li>
    {/each}
  </ul>
{:else}
  <div class="potluck-grid__empty">
    <p class="text-body-large">{emptyMessage}</p>
  </div>
{/if}

<style>
  .potluck-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--spacing-xl);
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .potluck-grid__item {
    display: flex;
    height: 100%;
  }

  .potluck-grid__empty {
    padding: var(--spacing-xl);
    background-color: var(--secondary-lightest);
    border-radius: var(--radius-lg);
    text-align: center;
  }

  .text-body-large {
    font-size: var(--font-size-lg);
    line-height: 1.6;
    color: var(--text-color-default);
  }
</style>
