<script lang="ts">
  import { onMount } from "svelte";
  import { quizStore, axisCounts } from "@/stores/quiz";
  import type { ArchetypeId } from "@/config/quiz/types";
  import { getArchetypeById } from "@/lib/quiz";
  import QuizResult from "./QuizResult.svelte";

  // Get profile from URL
  let profileId: ArchetypeId | null = null;
  let isLoaded = false;

  onMount(() => {
    // Initialize store from localStorage
    quizStore.initialize();

    // Get profile from URL params
    const urlParams = new URLSearchParams(window.location.search);
    profileId = urlParams.get("profile") as ArchetypeId | null;
    isLoaded = true;
  });

  // Get archetype from profile ID
  $: archetype = profileId ? getArchetypeById(profileId) : null;

  // Get axis counts - use actual if we have answers, otherwise generate from profile
  $: displayCounts = $quizStore.answers.length > 0
    ? $axisCounts
    : archetype
      ? {
          heat: { high: archetype.profile.heat === "high" ? 10 : 6, low: archetype.profile.heat === "low" ? 10 : 6 },
          sweet: { high: archetype.profile.sweet === "high" ? 10 : 6, low: archetype.profile.sweet === "low" ? 10 : 6 },
          zest: { high: archetype.profile.zest === "high" ? 10 : 6, low: archetype.profile.zest === "low" ? 10 : 6 },
          heft: { high: archetype.profile.heft === "high" ? 10 : 6, low: archetype.profile.heft === "low" ? 10 : 6 },
        }
      : null;
</script>

{#if !isLoaded}
  <div class="quiz-result-loading">
    <p>Loading your results...</p>
  </div>
{:else if archetype && displayCounts}
  <QuizResult {archetype} axisCounts={displayCounts} />
{:else}
  <div class="quiz-result-empty">
    <h2>No Results Yet</h2>
    <p>Take the quiz to discover your flavor profile!</p>
    <a href="/quiz/take/?new=true" class="quiz-result-empty__button">
      Start the Quiz
    </a>
  </div>
{/if}

<style>
  .quiz-result-loading {
    text-align: center;
    padding: var(--spacing-2xl);
    color: var(--text-color-default);
    opacity: 0.7;
  }

  .quiz-result-empty {
    text-align: center;
    padding: var(--spacing-3xl);
    background-color: var(--secondary-lightest);
    border-radius: var(--radius-lg);
  }

  .quiz-result-empty h2 {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    color: var(--text-color-default);
    margin: 0 0 var(--spacing-sm) 0;
  }

  .quiz-result-empty p {
    font-size: var(--font-size-md);
    color: var(--text-color-default);
    opacity: 0.8;
    margin: 0 0 var(--spacing-lg) 0;
  }

  .quiz-result-empty__button {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md) var(--spacing-xl);
    background-color: var(--accent);
    color: white;
    text-decoration: none;
    font-weight: var(--font-weight-medium);
    border-radius: var(--radius-md);
    transition:
      background-color var(--transition-fast) ease,
      transform var(--transition-fast) ease;
  }

  .quiz-result-empty__button:hover {
    background-color: var(--accent-dark);
    transform: translateY(-2px);
  }
</style>
