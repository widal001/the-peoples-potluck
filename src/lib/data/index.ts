/**
 * Data layer - unified API for fetching content from D1
 *
 * Uses:
 * - Runtime client (SSR): When Astro.locals.runtime.env.DB is available
 * - Build client (static): Uses Cloudflare REST API during `astro build`
 * - Content collections (fallback): For local dev without D1 credentials
 */

import { getCollection, getEntry } from "astro:content";
import type { CollectionEntry } from "astro:content";
import {
  isDatabaseAvailable,
  getItemsServiceFromAstro,
  type AstroContext,
} from "../db/astro-client";
import {
  createBuildTimeClient,
  type BuildTimeD1Client,
} from "../db/build-client";
import type { EnrichedItem } from "../services/items";
import type { Item, Tag } from "../db/schema";
import { type PotluckItem } from "../filters";
import {
  COLLECTION_KEYS,
  COLLECTIONS,
  type PotluckCategory,
} from "../../config/collections";
import { STATUSES, isValidStatusId } from "../../config/statuses";
import { getCategoryConfig } from "../../config/categories";

// Re-export EnrichedItem as the canonical Item type
export type { EnrichedItem } from "../services/items";

// Singleton build client (created once per build)
let buildClient: BuildTimeD1Client | null = null;

function getBuildClient(): BuildTimeD1Client {
  if (!buildClient) {
    buildClient = createBuildTimeClient();
  }
  return buildClient;
}

/**
 * Enrich a raw D1 Item with metadata from config files
 */
function enrichRawItem(item: Item, itemTags: Tag[]): EnrichedItem {
  const collectionId = item.collectionId as PotluckCategory;
  const statusId = isValidStatusId(item.statusId) ? item.statusId : "published";

  return {
    id: item.id,
    slug: item.slug,
    collectionId,
    title: item.title,
    description: item.description,
    content: item.content || undefined,
    categoryId: item.categoryId,
    tags: itemTags.map((t) => t.name),
    icon: item.icon || undefined,
    source: item.source || undefined,
    sourceUrl: item.sourceUrl || undefined,
    addedDate: item.addedDate || undefined,
    flavor: {
      heat: item.flavorHeat,
      sweet: item.flavorSweet,
      zest: item.flavorZest,
      heft: item.flavorHeft,
    },
    collection: COLLECTIONS[collectionId] || COLLECTIONS.settings,
    status: STATUSES[statusId],
    category: item.categoryId
      ? getCategoryConfig(collectionId, item.categoryId) || null
      : null,
  };
}

/**
 * Convert a content collection entry to EnrichedItem format (fallback)
 */
function contentEntryToEnrichedItem(
  entry: CollectionEntry<PotluckCategory>,
  category: PotluckCategory,
): EnrichedItem {
  return {
    id: `${category}-${entry.slug}`,
    slug: entry.slug,
    collectionId: category,
    title: entry.data.title,
    description: entry.data.description,
    categoryId: entry.data.category || null,
    tags: entry.data.tags || [],
    icon: entry.data.icon,
    source: entry.data.source,
    sourceUrl: entry.data.sourceUrl,
    addedDate: entry.data.addedDate,
    flavor: {
      heat: entry.data.flavor?.heat ?? null,
      sweet: entry.data.flavor?.sweet ?? null,
      zest: entry.data.flavor?.zest ?? null,
      heft: entry.data.flavor?.heft ?? null,
    },
    collection: COLLECTIONS[category],
    status: STATUSES.published,
    category: entry.data.category
      ? getCategoryConfig(category, entry.data.category) || null
      : null,
  };
}

/**
 * Get all items for a collection
 * Priority: Runtime D1 → Build-time D1 → Content collections
 */
export async function getCollectionItems(
  astro: AstroContext,
  category: PotluckCategory,
): Promise<EnrichedItem[]> {
  // 1. Try runtime D1 (SSR mode)
  if (isDatabaseAvailable(astro)) {
    const service = getItemsServiceFromAstro(astro);
    if (service) {
      try {
        const items = await service.getByCollection(category);
        return items;
      } catch (error) {
        console.error(`Runtime D1 query failed:`, error);
      }
    }
  }

  // 2. Try build-time D1 (static generation)
  const client = getBuildClient();
  if (client.isConfigured()) {
    try {
      const items = await client.getItemsByCollection(category);
      // Fetch tags for each item
      const enrichedItems = await Promise.all(
        items.map(async (item) => {
          const tags = await client.getTagsForItem(item.id);
          return enrichRawItem(item, tags);
        }),
      );
      return enrichedItems;
    } catch (error) {
      console.error(`Build-time D1 query failed:`, error);
    }
  }

  // 3. Fallback to content collections (local dev without D1)
  console.warn(
    `D1 not available, using content collection fallback for ${category}`,
  );
  const entries = await getCollection(category);
  return entries.map((entry) => contentEntryToEnrichedItem(entry, category));
}

/**
 * Get a single item by collection and slug
 * Priority: Runtime D1 → Build-time D1 → Content collections
 */
export async function getItemBySlug(
  astro: AstroContext,
  category: PotluckCategory,
  slug: string,
): Promise<EnrichedItem | null> {
  // 1. Try runtime D1 (SSR mode)
  if (isDatabaseAvailable(astro)) {
    const service = getItemsServiceFromAstro(astro);
    if (service) {
      try {
        const item = await service.getBySlug(category, slug);
        if (item) {
          return item;
        }
      } catch (error) {
        console.error(`Runtime D1 query failed:`, error);
      }
    }
  }

  // 2. Try build-time D1 (static generation)
  const client = getBuildClient();
  if (client.isConfigured()) {
    try {
      const item = await client.getItemBySlug(category, slug);
      if (item) {
        const tags = await client.getTagsForItem(item.id);
        return enrichRawItem(item, tags);
      }
    } catch (error) {
      console.error(`Build-time D1 query failed:`, error);
    }
  }

  // 3. Fallback to content collections (local dev without D1)
  console.warn(
    `D1 not available, using content collection fallback for ${category}/${slug}`,
  );
  const entry = await getEntry(category, slug);
  if (!entry) return null;
  return contentEntryToEnrichedItem(entry, category);
}

/**
 * Get all published items across all collections
 */
export async function getAllItems(
  astro: AstroContext,
): Promise<EnrichedItem[]> {
  const allItems: EnrichedItem[] = [];

  for (const category of COLLECTION_KEYS) {
    const items = await getCollectionItems(astro, category);
    allItems.push(...items);
  }

  return allItems;
}

/**
 * Convert null to undefined for flavor profile (for compatibility with UI components)
 */
function nullToUndefined(value: number | null): number | undefined {
  return value === null ? undefined : value;
}

/**
 * Convert EnrichedItem flavor to PotluckItem flavor format (null -> undefined)
 */
export function toFlavorProfile(
  flavor: EnrichedItem["flavor"],
): PotluckItem["flavor"] {
  return {
    heat: nullToUndefined(flavor.heat),
    sweet: nullToUndefined(flavor.sweet),
    zest: nullToUndefined(flavor.zest),
    heft: nullToUndefined(flavor.heft),
  };
}

/**
 * Convert EnrichedItem to PotluckItem for use with filter components
 */
export function toPotluckItem(item: EnrichedItem): PotluckItem {
  return {
    slug: item.slug,
    title: item.title,
    description: item.description,
    tags: item.tags,
    icon: item.icon,
    flavor: toFlavorProfile(item.flavor),
    relatedBites: [], // Would need to fetch from relations table
  };
}
