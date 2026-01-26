<script lang="ts">
  import type { Scenario } from "@/config/quiz/types";

  export let scenario: Scenario;
  export let isSelected: boolean = false;
  export let onSelect: () => void;

  function handleClick() {
    onSelect();
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    }
  }
</script>

<button
  type="button"
  class="quiz-option"
  class:quiz-option--selected={isSelected}
  on:click={handleClick}
  on:keydown={handleKeyDown}
  aria-pressed={isSelected}
>
  <div class="quiz-option__content">
    <h3 class="quiz-option__title">{scenario.title}</h3>
    <p class="quiz-option__description">{scenario.description}</p>
  </div>
  <div class="quiz-option__indicator" aria-hidden="true">
    {#if isSelected}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    {/if}
  </div>
</button>

<style>
  .quiz-option {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-md);
    width: 100%;
    padding: var(--spacing-lg);
    background-color: var(--background-default);
    border: var(--border-width-sm) solid var(--border-default);
    border-radius: var(--radius-lg);
    cursor: pointer;
    text-align: left;
    transition:
      border-color var(--transition-fast) ease,
      background-color var(--transition-fast) ease,
      transform var(--transition-fast) ease,
      box-shadow var(--transition-fast) ease;
  }

  .quiz-option:hover {
    border-color: var(--accent-light);
    background-color: var(--secondary-lightest);
    transform: translateY(-2px);
  }

  .quiz-option:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-light);
  }

  .quiz-option--selected {
    border-color: var(--accent);
    background-color: var(--accent-lightest, rgba(var(--accent-rgb), 0.1));
  }

  .quiz-option--selected:hover {
    border-color: var(--accent);
    background-color: var(--accent-lightest, rgba(var(--accent-rgb), 0.15));
  }

  .quiz-option__content {
    flex: 1;
    min-width: 0;
  }

  .quiz-option__title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--text-color-default);
    margin: 0 0 var(--spacing-xs) 0;
    line-height: 1.3;
  }

  .quiz-option__description {
    font-size: var(--font-size-md);
    color: var(--text-color-default);
    opacity: 0.8;
    margin: 0;
    line-height: 1.5;
  }

  .quiz-option__indicator {
    flex-shrink: 0;
    width: 1.5rem;
    height: 1.5rem;
    border: var(--border-width-md) solid var(--border-default);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      border-color var(--transition-fast) ease,
      background-color var(--transition-fast) ease;
  }

  .quiz-option--selected .quiz-option__indicator {
    border-color: var(--accent);
    background-color: var(--accent);
    color: white;
  }

  .quiz-option__indicator svg {
    width: 1rem;
    height: 1rem;
  }
</style>
