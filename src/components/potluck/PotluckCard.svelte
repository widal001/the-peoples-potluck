<script lang="ts">
  import type { PotluckItem, PotluckCategory } from "@/lib/filters/types";
  import {
    FLAVOR_AXES,
    AXIS_KEYS,
    MAX_FILTER_VALUE,
  } from "@/lib/filters/types";

  export let item: PotluckItem;
  export let category: PotluckCategory;
  export let href: string | undefined = undefined;

  // Default href if not provided
  $: linkHref = href ?? `/${category}/${item.slug}/`;

  // Truncate description for card view
  $: truncatedDescription =
    item.description.length > 150
      ? item.description.slice(0, 150) + "..."
      : item.description;

  // Limit tags to 4
  $: displayTags = item.tags?.slice(0, 4) ?? [];

  // Check if item has any flavor data
  $: hasFlavorData =
    item.flavor && AXIS_KEYS.some((key) => item.flavor?.[key] !== undefined);

  // Get flavor axes with values
  $: flavorEntries = hasFlavorData
    ? AXIS_KEYS.filter((key) => item.flavor?.[key] !== undefined).map(
        (key) => ({
          key,
          value: item.flavor![key]!,
          config: FLAVOR_AXES[key],
        })
      )
    : [];
</script>

<a
  href={linkHref}
  class="potluck-card-link"
  aria-label="Read more about {item.title}"
>
  <article class="potluck-card">
    <div class="potluck-card__header">
      {#if item.icon}
        <div
          class="potluck-icon potluck-icon--md"
          style="--icon-primary: {item.icon.primaryColor}; --icon-secondary: {item.icon.secondaryColor};"
          aria-hidden="true"
        ></div>
      {/if}
      <h3 class="potluck-card__title">{item.title}</h3>
    </div>

    <p class="potluck-card__description">{truncatedDescription}</p>

    {#if hasFlavorData}
      <div class="potluck-card__flavor">
        {#each flavorEntries as { key, value, config }}
          <div
            class="flavor-axis"
            title="{config.label}: {value}/{MAX_FILTER_VALUE}"
          >
            <svg
              class="flavor-axis__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              aria-hidden="true"
            >
              {@html config.icon}
            </svg>
            <div class="flavor-axis__dots">
              {#each Array(MAX_FILTER_VALUE) as _, i}
                <span
                  class="flavor-axis__dot"
                  class:flavor-axis__dot--filled={i < value}
                  aria-hidden="true"
                ></span>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    {/if}

    {#if displayTags.length > 0}
      <div class="potluck-card__tags">
        {#each displayTags as tag}
          <span class="tag-pill tag-pill--sm">{tag}</span>
        {/each}
      </div>
    {/if}
  </article>
</a>

<style>
  .potluck-card-link {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    text-decoration: none;
    color: inherit;
  }

  .potluck-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: var(--spacing-lg);
    background-color: var(--background-default);
    border: var(--border-width) solid var(--border-default);
    border-radius: var(--radius-lg);
    transition:
      transform var(--transition-normal) ease,
      border-color var(--transition-normal) ease,
      box-shadow var(--transition-normal) ease;
  }

  .potluck-card-link:hover .potluck-card,
  .potluck-card-link:focus .potluck-card {
    transform: translateY(-4px);
    border-color: var(--accent);
    box-shadow: var(--shadow-md);
  }

  .potluck-card-link:focus {
    outline: none;
  }

  .potluck-card-link:focus .potluck-card {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .potluck-card__header {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
  }

  .potluck-card__title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--text-color-default);
    margin: 0;
    line-height: 1.3;
  }

  .potluck-card__description {
    font-size: var(--font-size-md);
    color: var(--text-color-default);
    opacity: 0.8;
    margin: 0 0 var(--spacing-md) 0;
    flex-grow: 1;
    line-height: 1.5;
  }

  .potluck-card__flavor {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
  }

  .flavor-axis {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .flavor-axis__icon {
    width: 0.875rem;
    height: 0.875rem;
    flex-shrink: 0;
    color: var(--accent);
  }

  .flavor-axis__dots {
    display: flex;
    gap: 2px;
  }

  .flavor-axis__dot {
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 50%;
    background-color: var(--secondary-lighter);
  }

  .flavor-axis__dot--filled {
    background-color: var(--accent);
  }

  .potluck-card__tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
    margin-top: auto;
  }

  /* Inline PotluckIcon styles */
  .potluck-icon {
    display: block;
    border-radius: var(--radius-lg);
    background: linear-gradient(
      135deg,
      var(--icon-primary) 0%,
      var(--icon-secondary) 100%
    );
    flex-shrink: 0;
  }

  .potluck-icon--md {
    width: 3rem;
    height: 3rem;
  }

  /* Inline TagPill styles */
  .tag-pill {
    display: inline-block;
    background-color: var(--secondary-lightest);
    color: var(--secondary-dark);
    border-radius: var(--radius-md);
    font-weight: var(--font-weight-medium);
    white-space: nowrap;
  }

  .tag-pill--sm {
    padding: 0.125rem var(--spacing-sm);
    font-size: 0.75rem;
  }
</style>
