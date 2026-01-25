/**
 * Centralized collection configuration
 * Single source of truth for collection names, labels, URLs, and metadata
 */

// Collection keys - these must match the folder names in src/content/
export const COLLECTION_KEYS = [
  "settings",
  "dishes",
  "desserts",
  "drinks",
  "bites",
] as const;

export type PotluckCategory = (typeof COLLECTION_KEYS)[number];

// Full collection metadata
export interface CollectionConfig {
  key: PotluckCategory;
  label: string; // Display name (e.g., "Table Settings")
  labelSingular: string; // Singular form for badges (e.g., "table setting")
  path: string; // URL path (e.g., "/settings/")
  tagline: string; // Short tagline for headers
  description: string; // Full description
  purpose: string; // Why visitors come here (e.g., "To learn")
  mindset: string; // Visitor mindset (e.g., "I want to understand the landscape")
}

export const COLLECTIONS: Record<PotluckCategory, CollectionConfig> = {
  settings: {
    key: "settings",
    label: "Table Settings",
    labelSingular: "table setting",
    path: "/settings/",
    tagline: "Before we eat",
    description:
      "Understand the landscape. History, legislation, and local context that shapes the immigrant experience in Baltimore.",
    purpose: "To learn",
    mindset: "I want to understand the landscape",
  },
  dishes: {
    key: "dishes",
    label: "Dishes",
    labelSingular: "dish",
    path: "/dishes/",
    tagline: "What's on the table",
    description:
      "Find your people. Organizations, coalitions, and initiatives doing the work in our community.",
    purpose: "To get connected",
    mindset: "I want to find people doing this work",
  },
  desserts: {
    key: "desserts",
    label: "Desserts",
    labelSingular: "dessert",
    path: "/desserts/",
    tagline: "Worth saving room for",
    description:
      "See what's possible. Successes, case studies, and stories that show what community power can do.",
    purpose: "To get inspired",
    mindset: "I want to see what's possible",
  },
  drinks: {
    key: "drinks",
    label: "Drinks",
    labelSingular: "drink",
    path: "/drinks/",
    tagline: "What we're thirsting for",
    description:
      "Name what's missing. Gaps, needs, and ideas that are waiting for support.",
    purpose: "To express/discover needs",
    mindset: "I want to name what's missing",
  },
  bites: {
    key: "bites",
    label: "Sips & Bites",
    labelSingular: "sip & bite",
    path: "/bites/",
    tagline: "Dig in",
    description:
      "Do something today. Specific ways to get involved based on your skills and availability.",
    purpose: "To take action",
    mindset: "I want to do something now",
  },
};

// Helper to get collection config by key
export function getCollectionConfig(key: PotluckCategory): CollectionConfig {
  return COLLECTIONS[key];
}

// Helper to get all collection configs as array (in display order)
export function getAllCollections(): CollectionConfig[] {
  return COLLECTION_KEYS.map((key) => COLLECTIONS[key]);
}

// Helper to build navigation items from collection config
export function getCollectionNavItems(): Array<{
  label: string;
  href: string;
}> {
  return getAllCollections().map((c) => ({
    label: c.label,
    href: c.path,
  }));
}

// Helper to get category label (singular) for badges
export function getCategoryLabel(key: PotluckCategory): string {
  return COLLECTIONS[key]?.labelSingular || key;
}

// Main plate collections (what goes on "your plate")
export const PLATE_COLLECTION_KEYS = [
  "settings",
  "dishes",
  "desserts",
  "drinks",
] as const;

export type PlateCategory = (typeof PLATE_COLLECTION_KEYS)[number];

// Helper to get only plate collections (excludes bites)
export function getPlateCollections(): CollectionConfig[] {
  return PLATE_COLLECTION_KEYS.map((key) => COLLECTIONS[key]);
}

// Helper to get only the bites collection config
export function getBitesConfig(): CollectionConfig {
  return COLLECTIONS.bites;
}
