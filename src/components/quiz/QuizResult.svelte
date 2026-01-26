<script lang="ts">
  import type { Archetype, AxisCounts } from "@/config/quiz/types";
  import { TOTAL_QUESTIONS } from "@/lib/quiz";
  import ArchetypeCard from "./ArchetypeCard.svelte";
  import ScoreBreakdown from "./ScoreBreakdown.svelte";

  export let archetype: Archetype;
  export let axisCounts: AxisCounts;

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
      Based on your {TOTAL_QUESTIONS} choices, here's the engagement style that fits
      you best
    </p>
  </div>

  <div class="quiz-result__archetype">
    <ArchetypeCard {archetype} isHighlighted={true} />
  </div>

  <ScoreBreakdown {axisCounts} />

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
    border: var(--border-width-xs) solid var(--border-default);
  }

  .quiz-result__button--secondary:hover {
    background-color: var(--secondary-lightest);
  }

  @media (max-width: 480px) {
    .quiz-result__actions {
      flex-direction: column;
    }

    .quiz-result__button {
      width: 100%;
      justify-content: center;
    }
  }
</style>
