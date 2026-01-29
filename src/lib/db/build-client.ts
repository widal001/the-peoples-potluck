/**
 * Build-time D1 client using Cloudflare REST API
 * Used during `astro build` when Worker bindings aren't available
 */

import type { Item, Tag } from "./schema";

interface D1QueryResult<T> {
  results: T[];
  success: boolean;
  meta: {
    duration: number;
    changes: number;
    last_row_id: number;
    rows_read: number;
    rows_written: number;
  };
}

interface D1Response<T> {
  result: D1QueryResult<T>[];
  success: boolean;
  errors: Array<{ message: string }>;
}

/**
 * Build-time D1 client that uses the Cloudflare REST API
 */
export class BuildTimeD1Client {
  private accountId: string;
  private databaseId: string;
  private apiToken: string;

  constructor(config?: {
    accountId?: string;
    databaseId?: string;
    apiToken?: string;
  }) {
    this.accountId =
      config?.accountId || process.env.CLOUDFLARE_ACCOUNT_ID || "";
    this.databaseId = config?.databaseId || process.env.D1_DATABASE_ID || "";
    this.apiToken =
      config?.apiToken || process.env.CLOUDFLARE_API_TOKEN || "";

    if (!this.accountId || !this.databaseId || !this.apiToken) {
      console.warn(
        "BuildTimeD1Client: Missing credentials. Set CLOUDFLARE_ACCOUNT_ID, D1_DATABASE_ID, and CLOUDFLARE_API_TOKEN environment variables.",
      );
    }
  }

  /**
   * Execute a SQL query against D1 via REST API
   */
  private async query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/d1/database/${this.databaseId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql, params }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`D1 REST API error: ${response.status} - ${error}`);
    }

    const data = (await response.json()) as D1Response<T>;

    if (!data.success) {
      throw new Error(
        `D1 query failed: ${data.errors.map((e) => e.message).join(", ")}`,
      );
    }

    return data.result[0]?.results || [];
  }

  /**
   * Get all published items
   */
  async getPublishedItems(): Promise<Item[]> {
    return this.query<Item>(
      "SELECT * FROM items WHERE status_id = ? ORDER BY added_date DESC",
      ["published"],
    );
  }

  /**
   * Get published items by collection
   */
  async getItemsByCollection(collectionId: string): Promise<Item[]> {
    return this.query<Item>(
      "SELECT * FROM items WHERE collection_id = ? AND status_id = ? ORDER BY added_date DESC",
      [collectionId, "published"],
    );
  }

  /**
   * Get a single item by collection and slug
   */
  async getItemBySlug(
    collectionId: string,
    slug: string,
  ): Promise<Item | undefined> {
    const results = await this.query<Item>(
      "SELECT * FROM items WHERE collection_id = ? AND slug = ? LIMIT 1",
      [collectionId, slug],
    );
    return results[0];
  }

  /**
   * Get all tags
   */
  async getAllTags(): Promise<Tag[]> {
    return this.query<Tag>("SELECT * FROM tags ORDER BY name ASC");
  }

  /**
   * Get tags for an item
   */
  async getTagsForItem(itemId: string): Promise<Tag[]> {
    return this.query<Tag>(
      `SELECT t.* FROM tags t 
       INNER JOIN item_tags it ON t.id = it.tag_id 
       WHERE it.item_id = ?`,
      [itemId],
    );
  }

  /**
   * Check if the client is configured
   */
  isConfigured(): boolean {
    return !!(this.accountId && this.databaseId && this.apiToken);
  }
}

/**
 * Create a build-time D1 client
 */
export function createBuildTimeClient(config?: {
  accountId?: string;
  databaseId?: string;
  apiToken?: string;
}): BuildTimeD1Client {
  return new BuildTimeD1Client(config);
}
