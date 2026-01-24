<script lang="ts">
  import { filterState, setFilter } from "@/stores/filters";
  import type { FlavorAxis } from "@/lib/filters/types";
  import { MIN_FILTER_VALUE, MAX_FILTER_VALUE } from "@/lib/filters/types";
  import { isDefaultRange } from "@/lib/filters/filter-logic";

  export let axis: FlavorAxis;
  export let label: string;
  export let minLabel: string;
  export let maxLabel: string;
  export let min: number = MIN_FILTER_VALUE;
  export let max: number = MAX_FILTER_VALUE;

  // Read current value from store
  $: range = $filterState[axis];
  $: minValue = range[0];
  $: maxValue = range[1];

  // Display value text
  $: valueDisplay = isDefaultRange(range) ? "all" : `${minValue}-${maxValue}`;

  // Calculate fill position for visual range
  $: fillLeft = ((minValue - min) / (max - min)) * 100;
  $: fillRight = 100 - ((maxValue - min) / (max - min)) * 100;

  // Generate tick marks
  const ticks = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  function handleMinChange(event: Event) {
    const target = event.target as HTMLInputElement;
    let newMin = parseInt(target.value);
    // Don't let min exceed max
    if (newMin > maxValue) {
      newMin = maxValue;
      target.value = String(newMin);
    }
    setFilter(axis, [newMin, maxValue]);
  }

  function handleMaxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    let newMax = parseInt(target.value);
    // Don't let max go below min
    if (newMax < minValue) {
      newMax = minValue;
      target.value = String(newMax);
    }
    setFilter(axis, [minValue, newMax]);
  }

  // Check if a tick is within the selected range
  function isInRange(tick: number): boolean {
    return tick >= minValue && tick <= maxValue;
  }

  // Track which tick is being hovered on the track
  let hoveredTick: number | null = null;

  function handleTrackMouseMove(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const percentage = mouseX / rect.width;
    const value = Math.round(min + percentage * (max - min));
    hoveredTick = Math.max(min, Math.min(max, value));
  }

  function handleTrackMouseLeave() {
    hoveredTick = null;
  }

  // Handle click on track to jump to position
  function handleTrackClick(event: MouseEvent) {
    // Ignore clicks that originated from the input thumbs
    if ((event.target as HTMLElement).tagName === "INPUT") {
      return;
    }

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const clickedValue = Math.round(min + percentage * (max - min));
    jumpToValue(clickedValue);
  }

  // Handle click on tick label
  function handleTickClick(value: number) {
    jumpToValue(value);
  }

  // Jump the nearest handle to the given value
  function jumpToValue(targetValue: number) {
    const clampedValue = Math.max(min, Math.min(max, targetValue));

    // If clicking on the current min position, move max to join it
    if (clampedValue === minValue) {
      setFilter(axis, [clampedValue, clampedValue]);
      return;
    }

    // If clicking on the current max position, move min to join it
    if (clampedValue === maxValue) {
      setFilter(axis, [clampedValue, clampedValue]);
      return;
    }

    // If clicking outside the current range, move the appropriate handle
    if (clampedValue < minValue) {
      setFilter(axis, [clampedValue, maxValue]);
      return;
    }
    if (clampedValue > maxValue) {
      setFilter(axis, [minValue, clampedValue]);
      return;
    }

    // Clicking inside the range - determine which handle is closer
    const distToMin = Math.abs(clampedValue - minValue);
    const distToMax = Math.abs(clampedValue - maxValue);

    if (distToMin < distToMax) {
      setFilter(axis, [clampedValue, maxValue]);
    } else {
      setFilter(axis, [minValue, clampedValue]);
    }
  }
</script>

<div class="range-slider">
  <div class="range-slider__header">
    <span class="range-slider__label">{label}</span>
    <span class="range-slider__value">{valueDisplay}</span>
  </div>

  <div class="range-slider__labels">
    <span class="range-slider__endpoint">{minLabel}</span>
    <span class="range-slider__endpoint">{maxLabel}</span>
  </div>

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="range-slider__track-container"
    on:click={handleTrackClick}
    on:mousemove={handleTrackMouseMove}
    on:mouseleave={handleTrackMouseLeave}
  >
    <div class="range-slider__track">
      <div
        class="range-slider__range"
        style="left: {fillLeft}%; right: {fillRight}%;"
      ></div>
    </div>

    <input
      type="range"
      id="{axis}-min"
      name="{axis}-min"
      {min}
      {max}
      value={minValue}
      step="1"
      class="range-slider__input range-slider__input--min"
      aria-label="{label} minimum value"
      on:input={handleMinChange}
    />

    <input
      type="range"
      id="{axis}-max"
      name="{axis}-max"
      {min}
      {max}
      value={maxValue}
      step="1"
      class="range-slider__input range-slider__input--max"
      aria-label="{label} maximum value"
      on:input={handleMaxChange}
    />
  </div>

  <div class="range-slider__ticks">
    {#each ticks as tick}
      <button
        type="button"
        class="range-slider__tick"
        class:range-slider__tick--in-range={isInRange(tick)}
        class:range-slider__tick--hovered={hoveredTick === tick}
        on:click={() => handleTickClick(tick)}
        tabindex="-1"
      >
        {tick}
      </button>
    {/each}
  </div>
</div>

<style>
  .range-slider {
    --thumb-size: 1.25rem;
    --track-height: 0.375rem;
    --accent-color: var(--accent);
    --track-bg: var(--secondary-lighter);

    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    padding: var(--spacing-md);
    background-color: var(--background-default);
    border: var(--border-width) solid var(--border-default);
    border-radius: var(--radius-lg);
  }

  .range-slider__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .range-slider__label {
    font-weight: var(--font-weight-semibold);
    font-size: var(--font-size-md);
    color: var(--text-color-default);
  }

  .range-slider__value {
    font-size: var(--font-size-sm);
    color: var(--text-color-lighter);
    font-variant-numeric: tabular-nums;
    min-width: 2.5rem;
    text-align: right;
  }

  .range-slider__labels {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--spacing-xs);
  }

  .range-slider__endpoint {
    font-size: var(--font-size-xs);
    color: var(--text-color-lighter);
    font-style: italic;
  }

  .range-slider__track-container {
    position: relative;
    height: calc(var(--thumb-size) + var(--spacing-sm));
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .range-slider__track {
    position: absolute;
    left: 0;
    right: 0;
    height: var(--track-height);
    background-color: var(--track-bg);
    border-radius: var(--radius-full);
  }

  .range-slider__range {
    position: absolute;
    height: 100%;
    background-color: var(--accent-color);
    border-radius: var(--radius-full);
  }

  .range-slider__input {
    position: absolute;
    width: 100%;
    height: var(--thumb-size);
    background: transparent;
    pointer-events: none;
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }

  .range-slider__input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: var(--thumb-size);
    height: var(--thumb-size);
    background-color: var(--white);
    border: 2px solid var(--accent-color);
    border-radius: 50%;
    cursor: pointer;
    pointer-events: auto;
    box-shadow: var(--shadow-sm);
    transition:
      transform var(--transition-fast),
      box-shadow var(--transition-fast);
  }

  .range-slider__input::-moz-range-thumb {
    width: var(--thumb-size);
    height: var(--thumb-size);
    background-color: var(--white);
    border: 2px solid var(--accent-color);
    border-radius: 50%;
    cursor: pointer;
    pointer-events: auto;
    box-shadow: var(--shadow-sm);
    transition:
      transform var(--transition-fast),
      box-shadow var(--transition-fast);
  }

  .range-slider__input::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: var(--shadow-md);
  }

  .range-slider__input::-moz-range-thumb:hover {
    transform: scale(1.1);
    box-shadow: var(--shadow-md);
  }

  .range-slider__input:focus {
    outline: none;
  }

  .range-slider__input:focus-visible::-webkit-slider-thumb {
    outline: 2px solid var(--accent);
  }

  .range-slider__input:focus-visible::-moz-range-thumb {
    outline: 2px solid var(--accent);
  }

  .range-slider__ticks {
    display: flex;
    justify-content: space-between;
    padding: 0 calc(var(--thumb-size) / 2 - 0.25rem);
    margin-top: var(--spacing-xs);
  }

  .range-slider__tick {
    font-size: var(--font-size-xs);
    color: var(--text-color-lighter);
    width: 1rem;
    text-align: center;
    background: none;
    border: none;
    padding: var(--spacing-xs) 0;
    cursor: pointer;
    border-radius: var(--radius-sm);
    transition: color var(--transition-fast);
  }

  .range-slider__tick:hover,
  .range-slider__tick--hovered {
    color: var(--accent);
    text-decoration: underline;
  }

  .range-slider__tick--in-range {
    color: var(--accent-dark);
    font-weight: var(--font-weight-medium);
  }
</style>
