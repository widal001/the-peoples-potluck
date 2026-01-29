/**
 * Database Seed Script
 * Reads MDX content files and generates SQL to seed the D1 database
 *
 * Usage:
 *   pnpm db:seed:generate    # Generate SQL file
 *   pnpm db:seed             # Generate and apply to local DB
 */

import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import { COLLECTION_KEYS, type PotluckCategory } from "../src/config/collections";

// Types for MDX frontmatter
interface MDXFrontmatter {
  title: string;
  description: string;
  category?: string;
  tags?: string[];
  icon?: {
    svg: string;
    primaryColor: string;
    secondaryColor: string;
  };
  source?: string;
  sourceUrl?: string;
  addedDate?: string;
  flavor?: {
    heat?: number;
    sweet?: number;
    zest?: number;
    heft?: number;
  };
  relatedBites?: string[];
  relatedDishes?: string[];
  relatedDesserts?: string[];
  relatedDrinks?: string[];
  relatedSettings?: string[];
}

interface ParsedItem {
  id: string;
  collectionId: PotluckCategory;
  slug: string;
  title: string;
  description: string;
  content: string;
  categoryId: string | null;
  icon: string | null;
  source: string | null;
  sourceUrl: string | null;
  addedDate: string | null;
  flavorHeat: number | null;
  flavorSweet: number | null;
  flavorZest: number | null;
  flavorHeft: number | null;
  statusId: string;
  tags: string[];
  relatedItems: Array<{ toSlug: string; toCollection: string; relationType: string }>;
}

const CONTENT_DIR = path.join(process.cwd(), "src/content");

/**
 * Generate a deterministic ID from collection and slug
 */
function generateId(collection: string, slug: string): string {
  return `${collection}-${slug}`;
}

/**
 * Parse an MDX file and extract frontmatter and content
 */
function parseMDXFile(filePath: string, collection: PotluckCategory): ParsedItem | null {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    const frontmatter = data as MDXFrontmatter;

    const slug = path.basename(filePath, ".mdx");
    const id = generateId(collection, slug);

    // Collect related items
    const relatedItems: ParsedItem["relatedItems"] = [];

    if (frontmatter.relatedBites) {
      frontmatter.relatedBites.forEach((slug) => {
        relatedItems.push({ toSlug: slug, toCollection: "bites", relationType: "relatedBites" });
      });
    }
    if (frontmatter.relatedDishes) {
      frontmatter.relatedDishes.forEach((slug) => {
        relatedItems.push({ toSlug: slug, toCollection: "dishes", relationType: "relatedDishes" });
      });
    }
    if (frontmatter.relatedDesserts) {
      frontmatter.relatedDesserts.forEach((slug) => {
        relatedItems.push({ toSlug: slug, toCollection: "desserts", relationType: "relatedDesserts" });
      });
    }
    if (frontmatter.relatedDrinks) {
      frontmatter.relatedDrinks.forEach((slug) => {
        relatedItems.push({ toSlug: slug, toCollection: "drinks", relationType: "relatedDrinks" });
      });
    }
    if (frontmatter.relatedSettings) {
      frontmatter.relatedSettings.forEach((slug) => {
        relatedItems.push({ toSlug: slug, toCollection: "settings", relationType: "relatedSettings" });
      });
    }

    return {
      id,
      collectionId: collection,
      slug,
      title: frontmatter.title,
      description: frontmatter.description,
      content: content.trim(),
      categoryId: frontmatter.category || null,
      icon: frontmatter.icon ? JSON.stringify(frontmatter.icon) : null,
      source: frontmatter.source || null,
      sourceUrl: frontmatter.sourceUrl || null,
      addedDate: frontmatter.addedDate || null,
      flavorHeat: frontmatter.flavor?.heat || null,
      flavorSweet: frontmatter.flavor?.sweet || null,
      flavorZest: frontmatter.flavor?.zest || null,
      flavorHeft: frontmatter.flavor?.heft || null,
      statusId: "published",
      tags: frontmatter.tags || [],
      relatedItems,
    };
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error);
    return null;
  }
}

/**
 * Read all MDX files from a collection directory
 */
function readCollection(collection: PotluckCategory): ParsedItem[] {
  const collectionDir = path.join(CONTENT_DIR, collection);

  if (!fs.existsSync(collectionDir)) {
    console.warn(`Collection directory not found: ${collectionDir}`);
    return [];
  }

  const files = fs.readdirSync(collectionDir).filter((f) => f.endsWith(".mdx"));
  const items: ParsedItem[] = [];

  for (const file of files) {
    const item = parseMDXFile(path.join(collectionDir, file), collection);
    if (item) {
      items.push(item);
    }
  }

  return items;
}

/**
 * Extract unique tags from all items
 */
function extractTags(items: ParsedItem[]): Map<string, { name: string; slug: string }> {
  const tagsMap = new Map<string, { name: string; slug: string }>();

  for (const item of items) {
    for (const tag of item.tags) {
      const slug = tag.toLowerCase().replace(/\s+/g, "-");
      if (!tagsMap.has(slug)) {
        tagsMap.set(slug, { name: tag, slug });
      }
    }
  }

  return tagsMap;
}

/**
 * Generate SQL statements for seeding
 */
function generateSQL(items: ParsedItem[], tags: Map<string, { name: string; slug: string }>): string {
  const statements: string[] = [];

  // Clear existing data
  statements.push("DELETE FROM item_relations;");
  statements.push("DELETE FROM item_tags;");
  statements.push("DELETE FROM items;");
  statements.push("DELETE FROM tags;");

  // Insert tags
  for (const [slug, tag] of tags) {
    const id = `tag-${slug}`;
    statements.push(
      `INSERT INTO tags (id, name, slug) VALUES ('${id}', '${escapeSql(tag.name)}', '${escapeSql(tag.slug)}');`
    );
  }

  // Insert items
  for (const item of items) {
    statements.push(`INSERT INTO items (
      id, collection_id, slug, title, description, content, category_id,
      icon, source, source_url, added_date,
      flavor_heat, flavor_sweet, flavor_zest, flavor_heft, status_id
    ) VALUES (
      '${escapeSql(item.id)}',
      '${escapeSql(item.collectionId)}',
      '${escapeSql(item.slug)}',
      '${escapeSql(item.title)}',
      '${escapeSql(item.description)}',
      '${escapeSql(item.content)}',
      ${item.categoryId ? `'${escapeSql(item.categoryId)}'` : "NULL"},
      ${item.icon ? `'${escapeSql(item.icon)}'` : "NULL"},
      ${item.source ? `'${escapeSql(item.source)}'` : "NULL"},
      ${item.sourceUrl ? `'${escapeSql(item.sourceUrl)}'` : "NULL"},
      ${item.addedDate ? `'${escapeSql(item.addedDate)}'` : "NULL"},
      ${item.flavorHeat !== null ? item.flavorHeat : "NULL"},
      ${item.flavorSweet !== null ? item.flavorSweet : "NULL"},
      ${item.flavorZest !== null ? item.flavorZest : "NULL"},
      ${item.flavorHeft !== null ? item.flavorHeft : "NULL"},
      '${escapeSql(item.statusId)}'
    );`);

    // Insert item_tags
    for (const tag of item.tags) {
      const tagSlug = tag.toLowerCase().replace(/\s+/g, "-");
      const tagId = `tag-${tagSlug}`;
      statements.push(
        `INSERT INTO item_tags (item_id, tag_id) VALUES ('${escapeSql(item.id)}', '${escapeSql(tagId)}');`
      );
    }
  }

  // Insert item_relations
  // We need to do this after all items are inserted
  for (const item of items) {
    for (const rel of item.relatedItems) {
      const toItemId = generateId(rel.toCollection, rel.toSlug);
      // Only insert if the target item exists
      const targetExists = items.some((i) => i.id === toItemId);
      if (targetExists) {
        statements.push(
          `INSERT INTO item_relations (from_item_id, to_item_id, relation_type) VALUES ('${escapeSql(item.id)}', '${escapeSql(toItemId)}', '${escapeSql(rel.relationType)}');`
        );
      } else {
        console.warn(`Warning: Related item not found: ${toItemId} (referenced by ${item.id})`);
      }
    }
  }

  return statements.join("\n");
}

/**
 * Escape single quotes in SQL strings
 */
function escapeSql(str: string): string {
  return str.replace(/'/g, "''");
}

/**
 * Main execution
 */
async function main() {
  console.log("🌱 Reading content files...\n");

  // Read all collections
  const allItems: ParsedItem[] = [];
  for (const collection of COLLECTION_KEYS) {
    const items = readCollection(collection);
    console.log(`  📁 ${collection}: ${items.length} items`);
    allItems.push(...items);
  }

  console.log(`\n  Total: ${allItems.length} items\n`);

  // Extract tags
  const tags = extractTags(allItems);
  console.log(`  🏷️  ${tags.size} unique tags\n`);

  // Count relations
  const relationCount = allItems.reduce((acc, item) => acc + item.relatedItems.length, 0);
  console.log(`  🔗 ${relationCount} item relations\n`);

  // Generate SQL
  const sql = generateSQL(allItems, tags);

  // Write to seed file
  const seedDir = path.join(process.cwd(), "scripts");
  const seedFile = path.join(seedDir, "seed-data.sql");
  fs.writeFileSync(seedFile, sql, "utf-8");
  console.log(`✅ Generated seed SQL: ${seedFile}\n`);
}

main().catch(console.error);
