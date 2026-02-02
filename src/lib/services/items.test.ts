import { describe, it, expect, beforeEach } from "vitest";
import { env } from "cloudflare:test";
import { drizzle } from "drizzle-orm/d1";
import { ItemsService } from "./items";
import * as schema from "../db/schema";
import type { Database } from "../db/runtime-client";

describe("ItemsService", () => {
  let service: ItemsService;
  let db: Database;

  beforeEach(async () => {
    db = drizzle(env.DB, { schema });
    service = new ItemsService(db);

    // Seed test data
    await db.insert(schema.items).values([
      {
        id: "test-dish-1",
        collectionId: "dishes",
        slug: "test-nonprofit",
        title: "Test Nonprofit",
        description: "A test nonprofit organization",
        statusId: "published",
        categoryId: "nonprofit",
        flavorHeat: 3,
        flavorSweet: 4,
        flavorZest: 2,
        flavorHeft: 5,
        addedDate: "2024-01-15",
      },
      {
        id: "test-dish-2",
        collectionId: "dishes",
        slug: "test-coalition",
        title: "Test Coalition",
        description: "A test coalition",
        statusId: "published",
        categoryId: "coalition",
        flavorHeat: 5,
        flavorSweet: 2,
        flavorZest: 5,
        flavorHeft: 3,
        addedDate: "2024-01-10",
      },
      {
        id: "test-setting-1",
        collectionId: "settings",
        slug: "test-history",
        title: "Test History",
        description: "A test history item",
        statusId: "published",
        categoryId: "history",
        flavorHeat: 1,
        flavorSweet: 3,
        flavorZest: 1,
        flavorHeft: 2,
        addedDate: "2024-01-05",
      },
      {
        id: "test-pending",
        collectionId: "dishes",
        slug: "pending-item",
        title: "Pending Item",
        description: "An item pending review",
        statusId: "pending",
        categoryId: "grassroots",
        addedDate: "2024-01-20",
      },
    ]);

    // Seed tags
    await db.insert(schema.tags).values([
      { id: "tag-1", name: "Immigration", slug: "immigration" },
      { id: "tag-2", name: "Legal Aid", slug: "legal-aid" },
      { id: "tag-3", name: "Community", slug: "community" },
    ]);

    // Associate tags with items
    await db.insert(schema.itemTags).values([
      { itemId: "test-dish-1", tagId: "tag-1" },
      { itemId: "test-dish-1", tagId: "tag-2" },
      { itemId: "test-dish-2", tagId: "tag-1" },
      { itemId: "test-dish-2", tagId: "tag-3" },
    ]);
  });

  describe("getByCollection", () => {
    it("should return enriched items by collection", async () => {
      const dishes = await service.getByCollection("dishes");

      expect(dishes).toHaveLength(2);
      // Should be sorted by addedDate desc
      expect(dishes[0].slug).toBe("test-nonprofit");
      expect(dishes[1].slug).toBe("test-coalition");
    });

    it("should enrich items with collection metadata", async () => {
      const dishes = await service.getByCollection("dishes");
      const item = dishes[0];

      expect(item.collection.label).toBe("Dishes");
      expect(item.collection.key).toBe("dishes");
    });

    it("should enrich items with status metadata", async () => {
      const dishes = await service.getByCollection("dishes");
      const item = dishes[0];

      expect(item.status.label).toBe("Published");
      expect(item.status.id).toBe("published");
    });

    it("should enrich items with category metadata", async () => {
      const dishes = await service.getByCollection("dishes");
      const item = dishes.find((d) => d.slug === "test-nonprofit");

      expect(item?.category?.label).toBe("Nonprofit Organizations");
    });

    it("should include tags with items", async () => {
      const dishes = await service.getByCollection("dishes");
      const item = dishes.find((d) => d.slug === "test-nonprofit");

      expect(item?.tags).toHaveLength(2);
      expect(item?.tags).toContain("Immigration");
      expect(item?.tags).toContain("Legal Aid");
    });

    it("should not include pending items", async () => {
      const dishes = await service.getByCollection("dishes");
      const pendingItem = dishes.find((d) => d.slug === "pending-item");

      expect(pendingItem).toBeUndefined();
    });
  });

  describe("getBySlug", () => {
    it("should return a single enriched item", async () => {
      const item = await service.getBySlug("dishes", "test-nonprofit");

      expect(item).toBeDefined();
      expect(item?.title).toBe("Test Nonprofit");
      expect(item?.collection.label).toBe("Dishes");
    });

    it("should return undefined for non-existent items", async () => {
      const item = await service.getBySlug("dishes", "non-existent");

      expect(item).toBeUndefined();
    });

    it("should include pending items (for preview)", async () => {
      const item = await service.getBySlug("dishes", "pending-item");

      expect(item).toBeDefined();
      expect(item?.status.id).toBe("pending");
    });
  });

  describe("getByFlavorRange", () => {
    it("should filter by minimum heat", async () => {
      const spicy = await service.getByFlavorRange({ heatMin: 4 });

      expect(spicy).toHaveLength(1);
      expect(spicy[0].slug).toBe("test-coalition");
    });

    it("should filter by maximum heat", async () => {
      const mild = await service.getByFlavorRange({ heatMax: 2 });

      expect(mild).toHaveLength(1);
      expect(mild[0].slug).toBe("test-history");
    });

    it("should combine multiple filters", async () => {
      const filtered = await service.getByFlavorRange({
        heatMin: 2,
        heftMin: 4,
      });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].slug).toBe("test-nonprofit");
    });

    it("should include flavor profile values", async () => {
      const items = await service.getByFlavorRange({ heatMin: 3 });
      const item = items[0];

      // Flavor values should be simple numbers (or null)
      expect(item.flavor.heat).toBeGreaterThanOrEqual(3);
      expect(typeof item.flavor.heat).toBe("number");
    });
  });

  describe("getByTag", () => {
    it("should return items with a specific tag", async () => {
      const items = await service.getByTag("immigration");

      expect(items).toHaveLength(2);
    });

    it("should return empty array for non-existent tag", async () => {
      const items = await service.getByTag("non-existent");

      expect(items).toHaveLength(0);
    });
  });

  describe("getAllTags", () => {
    it("should return all tags sorted by name", async () => {
      const allTags = await service.getAllTags();

      expect(allTags).toHaveLength(3);
      expect(allTags[0].name).toBe("Community");
      expect(allTags[1].name).toBe("Immigration");
      expect(allTags[2].name).toBe("Legal Aid");
    });
  });

  describe("getPendingItems", () => {
    it("should return items pending review", async () => {
      const pending = await service.getPendingItems();

      expect(pending).toHaveLength(1);
      expect(pending[0].slug).toBe("pending-item");
      expect(pending[0].status.id).toBe("pending");
    });
  });

  describe("getAllPublished", () => {
    it("should return all published items across collections", async () => {
      const all = await service.getAllPublished();

      expect(all).toHaveLength(3);
      // Should not include pending item
      expect(all.find((i) => i.slug === "pending-item")).toBeUndefined();
    });
  });
});
