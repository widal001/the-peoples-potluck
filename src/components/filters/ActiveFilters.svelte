<script lang="ts">
  import { filterState, hasActiveFilters } from "@/stores/filters";
  import { getActiveFiltersFromState } from "@/lib/filters/url-sync";

  // Reactively get active filters when state changes
  $: activeFilters = getActiveFiltersFromState($filterState);
</script>

<dl
  class="active-filters"
  class:active-filters--hidden={!$hasActiveFilters}
  aria-live="polite"
  aria-label="Currently active flavor profile filters"
  aria-hidden={!$hasActiveFilters}
>
  <span class="active-filters__label">Active filters:</span>
  <div role="list" class="active-filters__list">
    {#each activeFilters as filter}
      <div class="filter-pill" role="listitem">
        <dt class="filter-pill__name">{filter.label}</dt>
        <dd
          class="filter-pill__value"
          aria-label="{filter.label} filter {filter.rangeDescription}"
        >
          {filter.rangeText}
        </dd>
      </div>
    {/each}
  </div>
</dl>

<style>
  .active-filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-md);
    margin: 0;
    min-height: 1.75rem; /* Reserve space when empty */
    transition: opacity var(--transition-normal);
  }

  .active-filters--hidden {
    opacity: 0;
    pointer-events: none;
  }

  .active-filters__label {
    font-size: var(--font-size-sm);
    color: var(--text-color-lighter);
    font-weight: var(--font-weight-medium);
  }

  .active-filters__list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-md);
  }

  .filter-pill {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    background-color: var(--secondary-lightest);
    color: var(--secondary-dark);
    padding: var(--spacing-xs) var(--spacing-md);
    border: 1px solid var(--secondary-lighter);
    border-radius: var(--radius-full);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    white-space: nowrap;
  }

  .filter-pill__name,
  .filter-pill__value {
    margin: 0;
    display: inline;
  }

  .filter-pill__name {
    font-weight: var(--font-weight-medium);
  }

  .filter-pill__name::after {
    content: " ";
  }

  .filter-pill__value {
    font-variant-numeric: tabular-nums;
    opacity: 0.8;
    font-weight: var(--font-weight-medium);
  }
</style>
