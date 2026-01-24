<script lang="ts">
  import { FLAVOR_AXES, resetAllFilters, hasActiveFilters } from "@/stores/filters";
  import RangeSlider from "./RangeSlider.svelte";
  import type { FlavorAxis } from "@/lib/filters/types";

  export let defaultOpen: boolean = false;

  let open = defaultOpen;

  // Convert FLAVOR_AXES record to array for iteration
  const axes = Object.entries(FLAVOR_AXES) as [
    FlavorAxis,
    { label: string; minLabel: string; maxLabel: string }
  ][];
</script>

<details class="filter-panel" bind:open>
  <summary class="filter-panel__toggle">
    <span class="filter-panel__toggle-text">Adjust flavor profile</span>
    <span class="filter-panel__toggle-indicator" aria-hidden="true"></span>
  </summary>
  <div class="filter-panel__content">
    <div class="filter-panel__sliders">
      {#each axes as [axis, config]}
        <RangeSlider
          {axis}
          label={config.label}
          minLabel={config.minLabel}
          maxLabel={config.maxLabel}
        />
      {/each}
    </div>
    <div class="filter-panel__actions">
      <button
        class="button-secondary button-sm"
        type="button"
        on:click={resetAllFilters}
        disabled={!$hasActiveFilters}
      >
        Reset filters
      </button>
    </div>
  </div>
</details>

<style>
  .filter-panel {
    margin-bottom: var(--spacing-xl);
    border: var(--border-width) solid var(--border-default);
    border-radius: var(--radius-lg);
    background-color: var(--secondary-lightest);
  }

  .filter-panel__toggle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md) var(--spacing-lg);
    cursor: pointer;
    user-select: none;
    font-weight: var(--font-weight-medium);
    color: var(--text-color-default);
    list-style: none;
  }

  .filter-panel__toggle::-webkit-details-marker {
    display: none;
  }

  .filter-panel__toggle:focus {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
    border-radius: var(--radius-md);
  }

  .filter-panel__toggle-indicator {
    width: 0.5rem;
    height: 0.5rem;
    border-right: 2px solid currentColor;
    border-bottom: 2px solid currentColor;
    transform: rotate(45deg);
    transition: transform var(--transition-fast);
  }

  .filter-panel[open] .filter-panel__toggle-indicator {
    transform: rotate(-135deg);
  }

  .filter-panel__content {
    padding: 0 var(--spacing-lg) var(--spacing-lg);
  }

  .filter-panel__sliders {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: var(--spacing-md);
  }

  .filter-panel__actions {
    display: flex;
    justify-content: flex-end;
    margin-top: var(--spacing-md);
  }

  /* Button styles (in case not globally available) */
  .button-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--text-color-default);
    background-color: var(--background-default);
    border: var(--border-width) solid var(--border-default);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition:
      background-color var(--transition-normal),
      border-color var(--transition-normal);
  }

  .button-secondary:hover:not(:disabled) {
    background-color: var(--secondary-lightest);
    border-color: var(--accent);
  }

  .button-secondary:focus {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .button-secondary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .button-sm {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-sm);
  }
</style>
