<script lang="ts">
  import type { Archetype } from "@/config/quiz/types";

  export let archetype: Archetype;
  export let isHighlighted: boolean = false;
  export let compact: boolean = false;
  export let href: string | undefined = undefined;

  $: linkHref = href ?? `/quiz/profiles/${archetype.slug}/`;

  // Get axis display info
  const axisLabels = {
    heat: { high: "Spicy", low: "Mild", icon: "flame" },
    sweet: { high: "Sweet", low: "Bitter", icon: "heart" },
    zest: { high: "Bold", low: "Subtle", icon: "sparkles" },
    heft: { high: "Hearty", low: "Light", icon: "scale" },
  };

  $: profileTags = (
    ["heat", "sweet", "zest", "heft"] as const
  ).map((axis) => ({
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
  <article class="archetype-card" class:archetype-card--highlighted={isHighlighted}>
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
        <span 
          class="profile-tag" 
          class:profile-tag--high={tag.isHigh}
        >
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
    border: 2px solid var(--border-default);
    border-radius: var(--radius-lg);
    transition:
      transform var(--transition-normal) ease,
      border-color var(--transition-normal) ease,
      box-shadow var(--transition-normal) ease;
  }

  .archetype-card-link:hover .archetype-card {
    transform: translateY(-4px);
    border-color: var(--accent-light);
    box-shadow: var(--shadow-md);
  }

  .archetype-card--highlighted {
    border-color: var(--accent);
    background: linear-gradient(
      135deg,
      var(--accent-lightest, rgba(var(--accent-rgb), 0.05)) 0%,
      var(--background-default) 100%
    );
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
    flex-grow: 1;
  }

  .archetype-card__profile {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-md);
  }

  .profile-tag {
    display: inline-block;
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    border-radius: var(--radius-md);
    background-color: var(--secondary-lightest);
    color: var(--secondary-dark);
  }

  .profile-tag--high {
    background-color: var(--accent-lightest, rgba(var(--accent-rgb), 0.15));
    color: var(--accent-dark);
  }

  .archetype-card__strengths {
    margin-top: auto;
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
