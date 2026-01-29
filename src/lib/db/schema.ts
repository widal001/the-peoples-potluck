import {
  sqliteTable,
  text,
  integer,
  index,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

// ============================================
// MAIN CONTENT TABLE
// ============================================

export const items = sqliteTable(
  "items",
  {
    id: text("id").primaryKey(),
    collectionId: text("collection_id").notNull(), // 'settings', 'dishes', etc.
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    content: text("content"), // MDX/markdown body
    categoryId: text("category_id"), // 'history', 'nonprofit', etc.
    icon: text("icon", { mode: "json" }).$type<{
      svg: string;
      primaryColor: string;
      secondaryColor: string;
    }>(),
    source: text("source"),
    sourceUrl: text("source_url"),
    addedDate: text("added_date"),

    // Flavor profile as separate columns for indexing/filtering
    flavorHeat: integer("flavor_heat"), // 1-5
    flavorSweet: integer("flavor_sweet"), // 1-5
    flavorZest: integer("flavor_zest"), // 1-5
    flavorHeft: integer("flavor_heft"), // 1-5

    // Moderation fields
    statusId: text("status_id").notNull().default("published"), // 'draft', 'pending', etc.
    submittedBy: text("submitted_by"),
    reviewedBy: text("reviewed_by"),
    reviewedAt: text("reviewed_at"),

    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("idx_items_collection_slug").on(table.collectionId, table.slug),
    index("idx_items_collection").on(table.collectionId),
    index("idx_items_status").on(table.statusId),
    index("idx_items_category").on(table.categoryId),
    // Flavor indexes for filtering
    index("idx_items_flavor_heat").on(table.flavorHeat),
    index("idx_items_flavor_sweet").on(table.flavorSweet),
    index("idx_items_flavor_zest").on(table.flavorZest),
    index("idx_items_flavor_heft").on(table.flavorHeft),
  ],
);

// ============================================
// TAGS (in DB for future user-contributed tags)
// ============================================

export const tags = sqliteTable("tags", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const itemTags = sqliteTable(
  "item_tags",
  {
    itemId: text("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.itemId, table.tagId] }),
    index("idx_item_tags_tag").on(table.tagId),
  ],
);

// ============================================
// ITEM RELATIONS
// ============================================

export const itemRelationsTable = sqliteTable(
  "item_relations",
  {
    fromItemId: text("from_item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    toItemId: text("to_item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    relationType: text("relation_type").notNull(), // 'relatedBites', 'relatedDishes', etc.
  },
  (table) => [
    primaryKey({
      columns: [table.fromItemId, table.toItemId, table.relationType],
    }),
    index("idx_item_relations_to").on(table.toItemId),
  ],
);

// ============================================
// DRIZZLE RELATIONS
// ============================================

export const itemsRelations = relations(items, ({ many }) => ({
  tags: many(itemTags),
  relatedFrom: many(itemRelationsTable, { relationName: "fromItem" }),
  relatedTo: many(itemRelationsTable, { relationName: "toItem" }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  items: many(itemTags),
}));

export const itemTagsRelations = relations(itemTags, ({ one }) => ({
  item: one(items, { fields: [itemTags.itemId], references: [items.id] }),
  tag: one(tags, { fields: [itemTags.tagId], references: [tags.id] }),
}));

export const itemRelationsTableRelations = relations(
  itemRelationsTable,
  ({ one }) => ({
    fromItem: one(items, {
      fields: [itemRelationsTable.fromItemId],
      references: [items.id],
      relationName: "fromItem",
    }),
    toItem: one(items, {
      fields: [itemRelationsTable.toItemId],
      references: [items.id],
      relationName: "toItem",
    }),
  }),
);

// ============================================
// TYPE EXPORTS
// ============================================

export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type ItemTag = typeof itemTags.$inferSelect;
export type ItemRelation = typeof itemRelationsTable.$inferSelect;
