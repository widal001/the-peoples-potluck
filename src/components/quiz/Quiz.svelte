<script lang="ts">
  import { onMount } from "svelte";
  import { getQuestionById, TOTAL_QUESTIONS } from "@/lib/quiz";
  import {
    quizStore,
    quizResult,
    canGoBack,
    isQuizComplete,
  } from "@/stores/quiz";
  import QuizProgress from "./QuizProgress.svelte";
  import QuizQuestion from "./QuizQuestion.svelte";

  // Track if we're transitioning (to prevent double-clicks)
  let isTransitioning = false;

  // Initialize store from localStorage on mount
  onMount(() => {
    // Check if this is a fresh start (new=true in URL)
    const urlParams = new URLSearchParams(window.location.search);
    const isNewQuiz = urlParams.get("new") === "true";

    if (isNewQuiz) {
      // Reset the store for a fresh quiz
      quizStore.reset();
      // Clean up the URL (remove ?new=true)
      window.history.replaceState({}, "", window.location.pathname);
    } else {
      // Resume existing quiz from localStorage
      quizStore.initialize();
    }
  });

  // Get current question
  $: currentQuestion = getQuestionById($quizStore.currentQuestion);

  // Get current answer if any
  $: currentAnswer = $quizStore.answers.find(
    (a) => a.questionId === $quizStore.currentQuestion,
  );

  // Handle option selection with delay for better UX
  function handleSelect(scenarioId: string) {
    if (isTransitioning) return;

    isTransitioning = true;

    // First, record the answer (shows selection)
    quizStore.recordAnswer(scenarioId);

    // Then advance after a brief delay so user sees their selection
    setTimeout(() => {
      quizStore.advanceQuestion();
      isTransitioning = false;
    }, 250);
  }

  // Navigation handlers
  function handleBack() {
    quizStore.previousQuestion();
  }

  function handleNext() {
    if ($quizStore.currentQuestion < TOTAL_QUESTIONS) {
      quizStore.nextQuestion();
    }
  }

  function handleViewResults() {
    if ($quizResult) {
      // Navigate to results page
      window.location.href = `/quiz/results/?profile=${$quizResult}`;
    }
  }

  function handleReset() {
    if (
      confirm(
        "Are you sure you want to start over? Your answers will be cleared.",
      )
    ) {
      quizStore.reset();
    }
  }
</script>

<div class="quiz">
  <QuizProgress
    currentQuestion={$quizStore.currentQuestion}
    answeredCount={$quizStore.answers.length}
  />

  <div class="quiz__content">
    {#if currentQuestion}
      <QuizQuestion
        question={currentQuestion}
        selectedScenarioId={currentAnswer?.scenarioId}
        onSelect={handleSelect}
      />
    {/if}
  </div>

  <div class="quiz__navigation">
    <button
      type="button"
      class="quiz__nav-button quiz__nav-button--secondary"
      disabled={!$canGoBack}
      on:click={handleBack}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Back
    </button>

    <button
      type="button"
      class="quiz__nav-button quiz__nav-button--text"
      on:click={handleReset}
    >
      Start over
    </button>

    {#if $isQuizComplete}
      <button
        type="button"
        class="quiz__nav-button quiz__nav-button--primary"
        on:click={handleViewResults}
      >
        See your results
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    {:else if currentAnswer}
      <button
        type="button"
        class="quiz__nav-button quiz__nav-button--primary"
        on:click={handleNext}
        disabled={$quizStore.currentQuestion >= TOTAL_QUESTIONS}
      >
        Next
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    {:else}
      <div class="quiz__nav-placeholder">
        <span class="quiz__nav-hint">Select an option to continue</span>
      </div>
    {/if}
  </div>
</div>

<style>
  .quiz {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xl);
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }

  .quiz__content {
    min-height: 400px;
  }

  .quiz__navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-md);
    padding-top: var(--spacing-lg);
    border-top: 1px solid var(--border-default);
  }

  .quiz__nav-button {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-sm) var(--spacing-lg);
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-medium);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition:
      background-color var(--transition-fast) ease,
      border-color var(--transition-fast) ease,
      opacity var(--transition-fast) ease;
  }

  .quiz__nav-button svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  .quiz__nav-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .quiz__nav-button--primary {
    background-color: var(--accent);
    color: white;
    border: none;
  }

  .quiz__nav-button--primary:hover:not(:disabled) {
    background-color: var(--accent-dark);
  }

  .quiz__nav-button--secondary {
    background-color: transparent;
    color: var(--text-color-default);
    border: 1px solid var(--border-default);
  }

  .quiz__nav-button--secondary:hover:not(:disabled) {
    background-color: var(--secondary-lightest);
    border-color: var(--border-default);
  }

  .quiz__nav-button--text {
    background-color: transparent;
    color: var(--text-color-default);
    opacity: 0.7;
    border: none;
    padding: var(--spacing-sm);
  }

  .quiz__nav-button--text:hover {
    opacity: 1;
  }

  .quiz__nav-placeholder {
    display: flex;
    align-items: center;
    padding: var(--spacing-sm) var(--spacing-lg);
  }

  .quiz__nav-hint {
    font-size: var(--font-size-sm);
    color: var(--text-color-default);
    opacity: 0.6;
    font-style: italic;
  }

  @media (max-width: 640px) {
    .quiz__navigation {
      flex-wrap: wrap;
      justify-content: center;
    }

    .quiz__nav-button--text {
      order: 3;
      width: 100%;
      text-align: center;
      margin-top: var(--spacing-sm);
    }
  }
</style>
