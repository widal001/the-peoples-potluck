<script lang="ts">
  import type { Archetype, AxisCounts, FlavorAxis } from "@/config/quiz/types";
  import { TOTAL_QUESTIONS, getConfidenceScores, getConfidenceDescription } from "@/lib/quiz";
  import ArchetypeCard from "./ArchetypeCard.svelte";

  export let archetype: Archetype;
  export let axisCounts: AxisCounts;

  // Calculate confidence for each axis
  $: confidenceScores = getConfidenceScores(axisCounts);

  // Axis display configuration
  const axisConfig: Record<FlavorAxis, { label: string; highLabel: string; lowLabel: string }> = {
    heat: { label: "Heat", highLabel: "Spicy", lowLabel: "Mild" },
    sweet: { label: "Sweet", highLabel: "Sweet", lowLabel: "Bitter" },
    zest: { label: "Zest", highLabel: "Bold", lowLabel: "Subtle" },
    heft: { label: "Heft", highLabel: "Hearty", lowLabel: "Light" },
  };

  // Get bar width percentages
  function getBarWidths(axis: FlavorAxis): { high: number; low: number } {
    const counts = axisCounts[axis];
    const total = counts.high + counts.low;
    if (total === 0) return { high: 50, low: 50 };
    return {
      high: (counts.high / total) * 100,
      low: (counts.low / total) * 100,
    };
  }

  function handleRetake() {
    window.location.href = "/quiz/take/?new=true";
  }

  function handleBrowseProfiles() {
    window.location.href = "/quiz/profiles/";
  }
</script>

<div class="quiz-result">
  <div class="quiz-result__header">
    <h1 class="quiz-result__title">Your Flavor Profile</h1>
    <p class="quiz-result__subtitle">
      Based on your {TOTAL_QUESTIONS} choices, here's the engagement style that fits you best
    </p>
  </div>

  <div class="quiz-result__archetype">
    <ArchetypeCard {archetype} isHighlighted={true} />
  </div>

  <div class="quiz-result__breakdown">
    <h2 class="quiz-result__breakdown-title">How You Scored</h2>
    
    <div class="axis-bars">
      {#each (["heat", "sweet", "zest", "heft"] as FlavorAxis[]) as axis}
        {@const config = axisConfig[axis]}
        {@const widths = getBarWidths(axis)}
        {@const counts = axisCounts[axis]}
        {@const winner = archetype.profile[axis]}
        {@const confidence = confidenceScores[axis]}
        
        <div class="axis-bar">
          <div class="axis-bar__header">
            <span class="axis-bar__label">{config.label}</span>
            <span class="axis-bar__confidence">
              {getConfidenceDescription(confidence)} preference
            </span>
          </div>
          
          <div class="axis-bar__track">
            <div 
              class="axis-bar__segment axis-bar__segment--low"
              class:axis-bar__segment--winner={winner === "low"}
              style="width: {widths.low}%"
            >
              <span class="axis-bar__segment-label">{config.lowLabel}</span>
              <span class="axis-bar__segment-count">{counts.low}</span>
            </div>
            <div 
              class="axis-bar__segment axis-bar__segment--high"
              class:axis-bar__segment--winner={winner === "high"}
              style="width: {widths.high}%"
            >
              <span class="axis-bar__segment-label">{config.highLabel}</span>
              <span class="axis-bar__segment-count">{counts.high}</span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div class="quiz-result__actions">
    <button
      type="button"
      class="quiz-result__button quiz-result__button--secondary"
      on:click={handleRetake}
    >
      Take quiz again
    </button>
    <button
      type="button"
      class="quiz-result__button quiz-result__button--primary"
      on:click={handleBrowseProfiles}
    >
      Explore all profiles
    </button>
  </div>
</div>

<style>
  .quiz-result {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xl);
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }

  .quiz-result__header {
    text-align: center;
  }

  .quiz-result__title {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-bold);
    color: var(--text-color-default);
    margin: 0 0 var(--spacing-sm) 0;
  }

  .quiz-result__subtitle {
    font-size: var(--font-size-lg);
    color: var(--text-color-default);
    opacity: 0.8;
    margin: 0;
  }

  .quiz-result__archetype {
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
  }

  .quiz-result__breakdown {
    background-color: var(--secondary-lightest);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
  }

  .quiz-result__breakdown-title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--text-color-default);
    margin: 0 0 var(--spacing-lg) 0;
    text-align: center;
  }

  .axis-bars {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .axis-bar {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .axis-bar__header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .axis-bar__label {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-semibold);
    color: var(--text-color-default);
  }

  .axis-bar__confidence {
    font-size: var(--font-size-sm);
    color: var(--text-color-default);
    opacity: 0.7;
  }

  .axis-bar__track {
    display: flex;
    height: 2.5rem;
    border-radius: var(--radius-md);
    overflow: hidden;
    background-color: var(--background-default);
  }

  .axis-bar__segment {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--spacing-sm);
    min-width: 3rem;
    transition: all var(--transition-normal) ease;
  }

  .axis-bar__segment--low {
    background-color: var(--secondary-light);
    color: var(--secondary-darkest);
  }

  .axis-bar__segment--high {
    background-color: var(--secondary);
    color: white;
  }

  .axis-bar__segment--winner {
    background-color: var(--accent);
    color: white;
  }

  .axis-bar__segment--winner.axis-bar__segment--low {
    background-color: var(--accent-light);
    color: var(--accent-darkest);
  }

  .axis-bar__segment-label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .axis-bar__segment-count {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
    flex-shrink: 0;
  }

  .quiz-result__actions {
    display: flex;
    justify-content: center;
    gap: var(--spacing-md);
    flex-wrap: wrap;
  }

  .quiz-result__button {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-md) var(--spacing-xl);
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-medium);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition:
      background-color var(--transition-fast) ease,
      border-color var(--transition-fast) ease;
  }

  .quiz-result__button--primary {
    background-color: var(--accent);
    color: white;
    border: none;
  }

  .quiz-result__button--primary:hover {
    background-color: var(--accent-dark);
  }

  .quiz-result__button--secondary {
    background-color: transparent;
    color: var(--text-color-default);
    border: 1px solid var(--border-default);
  }

  .quiz-result__button--secondary:hover {
    background-color: var(--secondary-lightest);
  }

  @media (max-width: 480px) {
    .axis-bar__segment-label {
      font-size: var(--font-size-xs);
    }

    .quiz-result__actions {
      flex-direction: column;
    }

    .quiz-result__button {
      width: 100%;
      justify-content: center;
    }
  }
</style>
