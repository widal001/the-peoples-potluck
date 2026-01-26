<script lang="ts">
  import { onMount } from "svelte";
  import { quizStore, isQuizComplete, quizResult } from "@/stores/quiz";

  onMount(() => {
    // Initialize store from localStorage
    quizStore.initialize();
  });
</script>

{#if $isQuizComplete && $quizResult}
  <a href="/quiz/results/?profile={$quizResult}" class="quiz-landing__button quiz-landing__button--primary">
    View Your Results
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  </a>
{:else}
  <a href="/quiz/take/?new=true" class="quiz-landing__button quiz-landing__button--primary">
    Start the Quiz
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  </a>
{/if}

<style>
  .quiz-landing__button {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md) var(--spacing-xl);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-medium);
    border-radius: var(--radius-md);
    text-decoration: none;
    transition:
      background-color var(--transition-fast) ease,
      transform var(--transition-fast) ease;
  }

  .quiz-landing__button svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  .quiz-landing__button--primary {
    background-color: var(--accent);
    color: white;
  }

  .quiz-landing__button--primary:hover {
    background-color: var(--accent-dark);
    transform: translateY(-2px);
  }

  @media (max-width: 640px) {
    .quiz-landing__button {
      justify-content: center;
    }
  }
</style>
