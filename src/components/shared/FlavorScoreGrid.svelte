<script lang="ts">
  /**
   * Shared flavor score grid component
   * Displays a 2x2 grid of flavor axis scores with consistent styling
   */

  export let title: string = "Flavor Profile";
  
  // Scores for each axis (1-5 scale)
  export let heat: number;
  export let sweet: number;
  export let zest: number;
  export let heft: number;
  
  // Optional custom explanations for each axis
  export let heatExplanation: string | undefined = undefined;
  export let sweetExplanation: string | undefined = undefined;
  export let zestExplanation: string | undefined = undefined;
  export let heftExplanation: string | undefined = undefined;

  // Axis configuration
  const axisConfig = {
    heat: {
      label: "Heat",
      summary: "risk tolerance",
      lowLabel: "Mild",
      highLabel: "Spicy",
      icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"/>`,
      defaultExplanations: {
        1: "You strongly prefer engaging through established channels over risky confrontations",
        2: "You tend toward safer approaches while occasionally stepping outside comfort zones",
        3: "You balance conventional methods with willingness to push boundaries when needed",
        4: "You often embrace bold tactics that challenge the status quo",
        5: "You thrive on high-stakes, confrontational engagement that demands attention",
      } as Record<number, string>,
    },
    sweet: {
      label: "Sweet",
      summary: "motivation",
      lowLabel: "Bitter",
      highLabel: "Sweet",
      icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>`,
      defaultExplanations: {
        1: "You're driven by urgency and frustration — channeling righteous anger into action",
        2: "You tend to be motivated by what's wrong, with occasional optimism",
        3: "You draw on both hope and frustration depending on the situation",
        4: "You're often motivated by possibility and connection with others",
        5: "You're fueled by hope, joy, and belief in what's possible",
      } as Record<number, string>,
    },
    zest: {
      label: "Zest",
      summary: "visibility",
      lowLabel: "Subtle",
      highLabel: "Bold",
      icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"/>`,
      defaultExplanations: {
        1: "You strongly prefer working behind the scenes, letting others take the spotlight",
        2: "You tend toward supporting roles while occasionally stepping forward",
        3: "You're comfortable both in front and behind the scenes as needed",
        4: "You often gravitate toward visible roles and public-facing work",
        5: "You thrive on the front lines, energized by visibility and direct engagement",
      } as Record<number, string>,
    },
    heft: {
      label: "Heft",
      summary: "commitment",
      lowLabel: "Light",
      highLabel: "Hearty",
      icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1.5M18.364 5.636l-1.06 1.06M21 12h-1.5M18.364 18.364l-1.06-1.06M12 19.5V21M7.05 7.05l-1.06-1.06M4.5 12H3M7.05 16.95l-1.06 1.06M12 12l4.5 4.5M12 12L7.5 7.5M12 12l4.5-4.5M12 12L7.5 16.5"/>`,
      defaultExplanations: {
        1: "You prefer quick, targeted contributions over long-term commitments",
        2: "You lean toward lighter involvement while occasionally going deeper",
        3: "You're flexible between short bursts of action and sustained engagement",
        4: "You often choose substantial, ongoing involvement in causes",
        5: "You're drawn to deep, sustained commitment that builds over time",
      } as Record<number, string>,
    },
  };

  // Build the data for rendering
  $: axisData = [
    { key: "heat", score: heat, customExplanation: heatExplanation },
    { key: "sweet", score: sweet, customExplanation: sweetExplanation },
    { key: "zest", score: zest, customExplanation: zestExplanation },
    { key: "heft", score: heft, customExplanation: heftExplanation },
  ] as const;

  function getExplanation(key: keyof typeof axisConfig, score: number, custom?: string): string {
    if (custom) return custom;
    const config = axisConfig[key];
    return config.defaultExplanations[score] || config.defaultExplanations[3];
  }
</script>

<div class="flavor-grid">
  <h3 class="flavor-grid__title">{title}</h3>

  <div class="flavor-grid__cells">
    {#each axisData as { key, score, customExplanation }}
      {@const config = axisConfig[key]}
      {@const isLowPreference = score < 3}
      {@const isHighPreference = score > 3}
      {@const explanation = getExplanation(key, score, customExplanation)}

      <div class="flavor-cell">
        <div class="flavor-cell__header">
          <span class="flavor-cell__name">
            <svg
              class="flavor-cell__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              aria-hidden="true"
            >
              {@html config.icon}
            </svg>
            {config.label}
            <span class="flavor-cell__summary">{config.summary}</span>
          </span>
        </div>

        <div class="flavor-cell__slider">
          <div class="flavor-cell__labels">
            <span
              class="flavor-cell__endpoint"
              class:flavor-cell__endpoint--highlighted={isLowPreference}
            >
              {config.lowLabel}
            </span>
            <span
              class="flavor-cell__endpoint"
              class:flavor-cell__endpoint--highlighted={isHighPreference}
            >
              {config.highLabel}
            </span>
          </div>

          <div class="flavor-cell__scale-wrapper">
            <div class="flavor-cell__track">
              <div 
                class="flavor-cell__fill" 
                style="width: {((score - 1) / 4) * 100}%"
              ></div>
              <div 
                class="flavor-cell__thumb" 
                style="left: {((score - 1) / 4) * 100}%"
              ></div>
            </div>

            <div class="flavor-cell__ticks">
              {#each [1, 2, 3, 4, 5] as tick}
                <span 
                  class="flavor-cell__tick" 
                  class:flavor-cell__tick--active={tick === score}
                  style="left: {((tick - 1) / 4) * 100}%"
                >{tick}</span>
              {/each}
            </div>
          </div>
        </div>

        <p class="flavor-cell__explanation">{explanation}</p>
      </div>
    {/each}
  </div>
</div>

<style>
  .flavor-grid {
    background-color: var(--secondary-lightest);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
  }

  .flavor-grid__title {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-semibold);
    color: var(--text-color-default);
    margin: 0 0 var(--spacing-lg) 0;
  }

  .flavor-grid__cells {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
  }

  .flavor-cell {
    background-color: var(--background-default);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .flavor-cell__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .flavor-cell__name {
    display: flex;
    align-items: baseline;
    gap: var(--spacing-xs);
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-semibold);
    color: var(--text-color-default);
  }

  .flavor-cell__icon {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--accent);
    align-self: center;
  }

  .flavor-cell__summary {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-normal);
    color: var(--text-color-lighter);
    margin-left: var(--spacing-xs);
  }

  .flavor-cell__slider {
    --thumb-size: 0.875rem;
    --track-height: 0.25rem;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .flavor-cell__labels {
    display: flex;
    justify-content: space-between;
  }

  .flavor-cell__endpoint {
    font-size: var(--font-size-xs);
    color: var(--text-color-lighter);
    font-style: italic;
    padding: 2px var(--spacing-xs);
    border-radius: var(--radius-sm);
    transition:
      background-color var(--transition-fast),
      color var(--transition-fast);
  }

  .flavor-cell__endpoint--highlighted {
    background-color: var(--accent-lightest, rgba(67, 111, 97, 0.12));
    color: var(--accent-dark);
    font-style: normal;
    font-weight: var(--font-weight-medium);
  }

  .flavor-cell__scale-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    /* Inset to account for thumb overhang */
    padding: 0 calc(var(--thumb-size) / 2);
  }

  .flavor-cell__track {
    position: relative;
    height: var(--thumb-size);
    display: flex;
    align-items: center;
  }

  .flavor-cell__track::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: var(--track-height);
    background-color: var(--secondary-lighter);
    border-radius: var(--radius-full);
  }

  .flavor-cell__fill {
    position: absolute;
    left: 0;
    height: var(--track-height);
    background-color: var(--accent);
    border-radius: var(--radius-full);
  }

  .flavor-cell__thumb {
    position: absolute;
    width: var(--thumb-size);
    height: var(--thumb-size);
    background-color: var(--white);
    border: 2px solid var(--accent);
    border-radius: 50%;
    transform: translateX(-50%);
    box-shadow: var(--shadow-sm);
  }

  .flavor-cell__ticks {
    position: relative;
    height: 1.25rem;
  }

  .flavor-cell__tick {
    position: absolute;
    font-size: var(--font-size-xs);
    color: var(--text-color-lighter);
    transform: translateX(-50%);
  }

  .flavor-cell__tick--active {
    color: var(--accent);
    font-weight: var(--font-weight-bold);
  }

  .flavor-cell__explanation {
    font-size: var(--font-size-sm);
    color: var(--text-color-default);
    line-height: 1.5;
    margin: 0;
    opacity: 0.85;
  }

  @media (max-width: 700px) {
    .flavor-grid__cells {
      grid-template-columns: 1fr;
    }
  }
</style>
