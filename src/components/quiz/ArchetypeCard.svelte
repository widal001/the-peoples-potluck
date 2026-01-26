<script lang="ts">
  import type { Archetype } from "@/config/quiz/types";

  export let archetype: Archetype;
  export let isHighlighted: boolean = false;
  export let compact: boolean = false;
  export let href: string | undefined = undefined;

  $: linkHref = href ?? `/quiz/profiles/${archetype.slug}/`;

  // Axis icons - same as FlavorProfile.astro (from @/lib/filters/types)
  const AXIS_ICONS = {
    heat: `<path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"/>`,
    sweet: `<path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>`,
    zest: `<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"/>`,
    heft: `<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1.5M18.364 5.636l-1.06 1.06M21 12h-1.5M18.364 18.364l-1.06-1.06M12 19.5V21M7.05 7.05l-1.06-1.06M4.5 12H3M7.05 16.95l-1.06 1.06M12 12l4.5 4.5M12 12L7.5 7.5M12 12l4.5-4.5M12 12L7.5 16.5"/>`,
  };

  // Get axis display info
  const axisLabels = {
    heat: { high: "Spicy", low: "Mild" },
    sweet: { high: "Sweet", low: "Bitter" },
    zest: { high: "Bold", low: "Subtle" },
    heft: { high: "Hearty", low: "Light" },
  };

  $: profileTags = (["heat", "sweet", "zest", "heft"] as const).map((axis) => ({
    axis,
    label: axisLabels[axis][archetype.profile[axis]],
    isHigh: archetype.profile[axis] === "high",
  }));
</script>

<a
  href={linkHref}
  class="archetype-card-link"
  class:archetype-card-link--highlighted={isHighlighted}
  class:archetype-card-link--compact={compact}
>
  <article
    class="archetype-card"
    class:archetype-card--highlighted={isHighlighted}
  >
    <div class="archetype-card__header">
      <h3 class="archetype-card__title">{archetype.label}</h3>
      {#if isHighlighted}
        <span class="archetype-card__badge">Your Profile</span>
      {/if}
    </div>

    <p class="archetype-card__tagline">{archetype.tagline}</p>

    {#if !compact}
      <p class="archetype-card__description">{archetype.description}</p>
    {/if}

    <div class="archetype-card__profile">
      {#each profileTags as tag}
        <span class="profile-tag" class:profile-tag--high={tag.isHigh}>
          <svg
            class="profile-tag__icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
          >
            {@html AXIS_ICONS[tag.axis]}
          </svg>
          {tag.label}
        </span>
      {/each}
    </div>

    {#if !compact && archetype.strengths.length > 0}
      <div class="archetype-card__strengths">
        <h4 class="archetype-card__strengths-title">Strengths</h4>
        <ul class="archetype-card__strengths-list">
          {#each archetype.strengths.slice(0, 3) as strength}
            <li>{strength}</li>
          {/each}
        </ul>
      </div>
    {/if}
  </article>
</a>

<style>
  .archetype-card-link {
    display: block;
    text-decoration: none;
    color: inherit;
    height: 100%;
  }

  .archetype-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: var(--spacing-lg);
    background-color: var(--background-default);
    border: var(--border-width-md) solid var(--border-default);
    border-radius: var(--radius-lg);
    transition:
      transform var(--transition-normal) ease,
      border-color var(--transition-normal) ease,
      box-shadow var(--transition-normal) ease;
  }

  .archetype-card-link:hover .archetype-card {
    transform: translateY(-4px);
    border-color: var(--accent);
    box-shadow: var(--shadow-md);
  }

  .archetype-card--highlighted {
    border-color: var(--accent);
  }

  .archetype-card-link--highlighted:hover .archetype-card {
    border-color: var(--accent);
  }

  .archetype-card-link--compact .archetype-card {
    padding: var(--spacing-md);
  }

  .archetype-card__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
  }

  .archetype-card__title {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    color: var(--text-color-default);
    margin: 0;
    line-height: 1.2;
  }

  .archetype-card-link--compact .archetype-card__title {
    font-size: var(--font-size-lg);
  }

  .archetype-card__badge {
    flex-shrink: 0;
    padding: var(--spacing-xs) var(--spacing-sm);
    background-color: var(--accent);
    color: white;
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    border-radius: var(--radius-md);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .archetype-card__tagline {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-medium);
    color: var(--accent-dark);
    margin: 0 0 var(--spacing-md) 0;
    line-height: 1.4;
  }

  .archetype-card__description {
    font-size: var(--font-size-md);
    color: var(--text-color-default);
    opacity: 0.85;
    margin: 0 0 var(--spacing-lg) 0;
    line-height: 1.6;
  }

  .archetype-card__profile {
    display: flex;
    flex-wrap: nowrap;
    gap: 0.375rem;
    margin-top: auto;
    margin-bottom: var(--spacing-md);
  }

  .archetype-card-link--compact .archetype-card__profile {
    margin-bottom: 0;
  }

  .profile-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: var(--font-weight-medium);
    border-radius: var(--radius-full, 9999px);
    background-color: var(--accent-lighter);
    color: var(--accent-darkest);
    white-space: nowrap;
  }

  .profile-tag__icon {
    width: 0.85rem;
    height: 0.85rem;
    flex-shrink: 0;
  }

  .profile-tag--high {
    background-color: var(--accent);
    color: var(--white);
  }

  .archetype-card__strengths {
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--border-default);
  }

  .archetype-card__strengths-title {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--text-color-default);
    opacity: 0.7;
    margin: 0 0 var(--spacing-xs) 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .archetype-card__strengths-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .archetype-card__strengths-list li {
    font-size: var(--font-size-sm);
    color: var(--text-color-default);
    opacity: 0.85;
    padding: var(--spacing-xs) 0;
    padding-left: var(--spacing-md);
    position: relative;
  }

  .archetype-card__strengths-list li::before {
    content: "•";
    position: absolute;
    left: 0;
    color: var(--accent);
  }
</style>
