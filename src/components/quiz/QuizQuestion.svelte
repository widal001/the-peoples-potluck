<script lang="ts">
  import type { QuizQuestion, Scenario } from "@/config/quiz/types";
  import { getScenarioById } from "@/lib/quiz";
  import QuizOption from "./QuizOption.svelte";

  export let question: QuizQuestion;
  export let selectedScenarioId: string | undefined = undefined;
  export let onSelect: (scenarioId: string) => void;

  // Get scenario objects for each option
  $: scenarios = question.scenarioIds
    .map((id) => getScenarioById(id))
    .filter((s): s is Scenario => s !== undefined);

  function handleSelect(scenarioId: string) {
    onSelect(scenarioId);
  }
</script>

<div class="quiz-question">
  <h2 class="quiz-question__prompt">{question.prompt}</h2>
  
  <div class="quiz-question__options">
    {#each scenarios as scenario (scenario.id)}
      <QuizOption
        {scenario}
        isSelected={selectedScenarioId === scenario.id}
        onSelect={() => handleSelect(scenario.id)}
      />
    {/each}
  </div>
</div>

<style>
  .quiz-question {
    width: 100%;
  }

  .quiz-question__prompt {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    color: var(--text-color-default);
    margin: 0 0 var(--spacing-xl) 0;
    line-height: 1.4;
    text-align: center;
  }

  .quiz-question__options {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  @media (min-width: 768px) {
    .quiz-question__options {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-lg);
    }
  }
</style>
