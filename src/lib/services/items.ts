/**
 * ItemsService - CRUD operations for content items with enrichment
 * Enriches database records with presentation metadata from config files
 */

import { eq, and, gte, lte, inArray } from "drizzle-orm";
import { items, itemTags, tags, itemRelationsTable } from "../db/schema";
import type { Database } from "../db/runtime-client";
import type * as schema from "../db/schema";
import { COLLECTIONS, type PotluckCategory } from "../../config/collections";
import {
  STATUSES,
  type StatusId,
  isValidStatusId,
} from "../../config/statuses";
import { getCategoryConfig } from "../../config/categories";

/**
 * Flavor profile with nullable values (matches DB schema)
 */
export interface FlavorProfile {
  heat: number | null;
  sweet: number | null;
  zest: number | null;
  heft: number | null;
}

/**
 * Enriched item type with config metadata
 * This is the canonical item type used throughout the app
 */
export interface EnrichedItem {
  // Core fields
  id: string;
  slug: string;
  collectionId: PotluckCategory;
  title: string;
  description: string;
  content?: string;
  categoryId: string | null;
  
  // Display fields
  tags: string[];
  icon?: {
    svg: string;
    primaryColor: string;
    secondaryColor: string;
  };
  source?: string;
  sourceUrl?: string;
  addedDate?: string;
  flavor: FlavorProfile;
  
  // Enriched metadata from config
  collection: (typeof COLLECTIONS)[PotluckCategory];
  status: (typeof STATUSES)[StatusId];
  category: { id: string; label: string } | null;
}

/**
 * Flavor filter options
 */
export interface FlavorFilter {
  heatMin?: number;
  heatMax?: number;
  sweetMin?: number;
  sweetMax?: number;
  zestMin?: number;
  zestMax?: number;
  heftMin?: number;
  heftMax?: number;
}

/**
 * ItemsService provides CRUD operations for content items
 */
export class ItemsService {
  constructor(private db: Database) {}

  /**
   * Enrich a database item with config metadata
   */
  private enrichItem(
    item: schema.Item,
    itemTagsList: schema.Tag[],
  ): EnrichedItem {
    const collectionId = item.collectionId as PotluckCategory;
    const statusId = isValidStatusId(item.statusId)
      ? item.statusId
      : "published";

    return {
      id: item.id,
      slug: item.slug,
      collectionId,
      title: item.title,
      description: item.description,
      content: item.content || undefined,
      categoryId: item.categoryId,
      tags: itemTagsList.map((t) => t.name),
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
   * Get all published items for a collection
   */
  async getByCollection(
    collectionId: PotluckCategory,
  ): Promise<EnrichedItem[]> {
    const results = await this.db.query.items.findMany({
      where: and(
        eq(items.collectionId, collectionId),
        eq(items.statusId, "published"),
      ),
      with: {
        tags: { with: { tag: true } },
      },
      orderBy: (items, { desc }) => [desc(items.addedDate)],
    });

    return results.map((r) =>
      this.enrichItem(
        r,
        r.tags.map((t) => t.tag),
      ),
    );
  }

  /**
   * Get a single item by collection and slug
   */
  async getBySlug(
    collectionId: PotluckCategory,
    slug: string,
  ): Promise<EnrichedItem | undefined> {
    const result = await this.db.query.items.findFirst({
      where: and(eq(items.collectionId, collectionId), eq(items.slug, slug)),
      with: {
        tags: { with: { tag: true } },
      },
    });

    if (!result) return undefined;
    return this.enrichItem(
      result,
      result.tags.map((t) => t.tag),
    );
  }

  /**
   * Get all published items across all collections
   */
  async getAllPublished(): Promise<EnrichedItem[]> {
    const results = await this.db.query.items.findMany({
      where: eq(items.statusId, "published"),
      with: {
        tags: { with: { tag: true } },
      },
      orderBy: (items, { desc }) => [desc(items.addedDate)],
    });

    return results.map((r) =>
      this.enrichItem(
        r,
        r.tags.map((t) => t.tag),
      ),
    );
  }

  /**
   * Get items filtered by flavor profile
   */
  async getByFlavorRange(filters: FlavorFilter): Promise<EnrichedItem[]> {
    const conditions = [eq(items.statusId, "published")];

    if (filters.heatMin !== undefined) {
      conditions.push(gte(items.flavorHeat, filters.heatMin));
    }
    if (filters.heatMax !== undefined) {
      conditions.push(lte(items.flavorHeat, filters.heatMax));
    }
    if (filters.sweetMin !== undefined) {
      conditions.push(gte(items.flavorSweet, filters.sweetMin));
    }
    if (filters.sweetMax !== undefined) {
      conditions.push(lte(items.flavorSweet, filters.sweetMax));
    }
    if (filters.zestMin !== undefined) {
      conditions.push(gte(items.flavorZest, filters.zestMin));
    }
    if (filters.zestMax !== undefined) {
      conditions.push(lte(items.flavorZest, filters.zestMax));
    }
    if (filters.heftMin !== undefined) {
      conditions.push(gte(items.flavorHeft, filters.heftMin));
    }
    if (filters.heftMax !== undefined) {
      conditions.push(lte(items.flavorHeft, filters.heftMax));
    }

    const results = await this.db.query.items.findMany({
      where: and(...conditions),
      with: { tags: { with: { tag: true } } },
      orderBy: (items, { desc }) => [desc(items.addedDate)],
    });

    return results.map((r) =>
      this.enrichItem(
        r,
        r.tags.map((t) => t.tag),
      ),
    );
  }

  /**
   * Get items by tag slug
   */
  async getByTag(tagSlug: string): Promise<EnrichedItem[]> {
    // First find the tag
    const tag = await this.db.query.tags.findFirst({
      where: eq(tags.slug, tagSlug),
    });

    if (!tag) return [];

    // Get item IDs that have this tag
    const taggedItemIds = await this.db
      .select({ itemId: itemTags.itemId })
      .from(itemTags)
      .where(eq(itemTags.tagId, tag.id));

    if (taggedItemIds.length === 0) return [];

    // Get the items
    const results = await this.db.query.items.findMany({
      where: and(
        eq(items.statusId, "published"),
        inArray(
          items.id,
          taggedItemIds.map((t) => t.itemId),
        ),
      ),
      with: { tags: { with: { tag: true } } },
      orderBy: (items, { desc }) => [desc(items.addedDate)],
    });

    return results.map((r) =>
      this.enrichItem(
        r,
        r.tags.map((t) => t.tag),
      ),
    );
  }

  /**
   * Get all tags
   */
  async getAllTags(): Promise<schema.Tag[]> {
    return this.db.select().from(tags).orderBy(tags.name);
  }

  /**
   * Get related items for a given item
   */
  async getRelatedItems(
    itemId: string,
    relationType?: string,
  ): Promise<EnrichedItem[]> {
    const conditions = [eq(itemRelationsTable.fromItemId, itemId)];
    if (relationType) {
      conditions.push(eq(itemRelationsTable.relationType, relationType));
    }

    const relations = await this.db
      .select({ toItemId: itemRelationsTable.toItemId })
      .from(itemRelationsTable)
      .where(and(...conditions));

    if (relations.length === 0) return [];

    const results = await this.db.query.items.findMany({
      where: and(
        eq(items.statusId, "published"),
        inArray(
          items.id,
          relations.map((r) => r.toItemId),
        ),
      ),
      with: { tags: { with: { tag: true } } },
    });

    return results.map((r) =>
      this.enrichItem(
        r,
        r.tags.map((t) => t.tag),
      ),
    );
  }

  /**
   * Get items pending review (for moderation)
   */
  async getPendingItems(): Promise<EnrichedItem[]> {
    const results = await this.db.query.items.findMany({
      where: eq(items.statusId, "pending"),
      with: { tags: { with: { tag: true } } },
      orderBy: (items, { asc }) => [asc(items.createdAt)],
    });

    return results.map((r) =>
      this.enrichItem(
        r,
        r.tags.map((t) => t.tag),
      ),
    );
  }
}

/**
 * Create an ItemsService instance
 */
export function createItemsService(db: Database): ItemsService {
  return new ItemsService(db);
}
