<script lang="ts">
  import type { Archetype, AxisCounts } from "@/config/quiz/types";
  import { TOTAL_QUESTIONS } from "@/lib/quiz";
  import ArchetypeCard from "./ArchetypeCard.svelte";
  import ScoreBreakdown from "./ScoreBreakdown.svelte";
  import type { FilterRange } from "@/lib/filters/types";

  export let archetype: Archetype;
  export let axisCounts: AxisCounts;

  // Convert quiz score (1-5) to filter range
  // Adds 1 in each direction when possible
  function scoreToFilterRange(score: number): FilterRange {
    switch (score) {
      case 1:
        return [1, 2];
      case 2:
        return [1, 3];
      case 3:
        return [2, 4];
      case 4:
        return [3, 5];
      case 5:
        return [4, 5];
      default:
        return [1, 5];
    }
  }

  // Convert counts to normalized score (1-5)
  function getNormalizedScore(counts: { high: number; low: number }): number {
    const total = counts.high + counts.low;
    if (total === 0) return 3;
    const ratio = counts.high / total;
    const score = Math.round(ratio * 4) + 1;
    return Math.max(1, Math.min(5, score));
  }

  // Calculate scores for each axis
  $: heatScore = getNormalizedScore(axisCounts.heat);
  $: sweetScore = getNormalizedScore(axisCounts.sweet);
  $: zestScore = getNormalizedScore(axisCounts.zest);
  $: heftScore = getNormalizedScore(axisCounts.heft);

  // Build filter URL
  $: plateUrl = (() => {
    const heatRange = scoreToFilterRange(heatScore);
    const sweetRange = scoreToFilterRange(sweetScore);
    const zestRange = scoreToFilterRange(zestScore);
    const heftRange = scoreToFilterRange(heftScore);

    const params = new URLSearchParams();
    params.set("heat", `${heatRange[0]}-${heatRange[1]}`);
    params.set("sweet", `${sweetRange[0]}-${sweetRange[1]}`);
    params.set("zest", `${zestRange[0]}-${zestRange[1]}`);
    params.set("heft", `${heftRange[0]}-${heftRange[1]}`);

    return `/plate/?${params.toString()}`;
  })();
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
    <a href={plateUrl} class="quiz-result__button quiz-result__button--primary">
      Make me a plate
    </a>
    <a
      href="/quiz/take/?new=true"
      class="quiz-result__button quiz-result__button--secondary"
    >
      Take quiz again
    </a>
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
    text-decoration: none;
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
