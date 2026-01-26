<script lang="ts">
  import { TOTAL_QUESTIONS } from "@/lib/quiz";

  export let currentQuestion: number;
  export let answeredCount: number;

  $: progressPercent = (answeredCount / TOTAL_QUESTIONS) * 100;
</script>

<div class="quiz-progress" role="progressbar" aria-valuenow={answeredCount} aria-valuemin={0} aria-valuemax={TOTAL_QUESTIONS}>
  <div class="quiz-progress__header">
    <span class="quiz-progress__label">
      Question {currentQuestion} of {TOTAL_QUESTIONS}
    </span>
    <span class="quiz-progress__count">
      {answeredCount} answered
    </span>
  </div>
  <div class="quiz-progress__track">
    <div 
      class="quiz-progress__bar" 
      style="width: {progressPercent}%"
    ></div>
    <!-- Question markers -->
    <div class="quiz-progress__markers">
      {#each Array(TOTAL_QUESTIONS) as _, i}
        <div 
          class="quiz-progress__marker"
          class:quiz-progress__marker--current={i + 1 === currentQuestion}
          class:quiz-progress__marker--answered={i < answeredCount}
          aria-hidden="true"
        ></div>
      {/each}
    </div>
  </div>
</div>

<style>
  .quiz-progress {
    width: 100%;
  }

  .quiz-progress__header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: var(--spacing-sm);
  }

  .quiz-progress__label {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-semibold);
    color: var(--text-color-default);
  }

  .quiz-progress__count {
    font-size: var(--font-size-sm);
    color: var(--text-color-default);
    opacity: 0.7;
  }

  .quiz-progress__track {
    position: relative;
    height: 0.5rem;
    background-color: var(--secondary-lighter);
    border-radius: var(--radius-full);
    overflow: visible;
  }

  .quiz-progress__bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: var(--accent);
    border-radius: var(--radius-full);
    transition: width var(--transition-normal) ease;
  }

  .quiz-progress__markers {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    transform: translateY(-50%);
    padding: 0 2px;
  }

  .quiz-progress__marker {
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 50%;
    background-color: var(--secondary-light);
    transition: 
      background-color var(--transition-fast) ease,
      transform var(--transition-fast) ease;
  }

  .quiz-progress__marker--answered {
    background-color: var(--accent);
  }

  .quiz-progress__marker--current {
    background-color: var(--accent);
    transform: scale(1.5);
    box-shadow: 0 0 0 2px var(--background-default);
  }
</style>
