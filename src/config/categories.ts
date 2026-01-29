/**
 * Category configuration by collection
 * Maps category codes to display labels and metadata
 */

import type { PotluckCategory } from "./collections";

export interface CategoryConfig {
  id: string;
  label: string;
  description?: string;
}

// Settings categories: To learn
export const SETTINGS_CATEGORIES = {
  history: {
    id: "history",
    label: "Historical Context",
    description: "Timelines and historical background",
  },
  legislation: {
    id: "legislation",
    label: "Laws & Policies",
    description: "Laws, policies, and executive orders",
  },
  data: {
    id: "data",
    label: "Demographics & Statistics",
    description: "Research, statistics, and data",
  },
  rights: {
    id: "rights",
    label: "Know Your Rights",
    description: "Legal tools and rights information",
  },
} as const;

export type SettingsCategoryId = keyof typeof SETTINGS_CATEGORIES;

// Dishes categories: To get connected
export const DISHES_CATEGORIES = {
  government: {
    id: "government",
    label: "Government Agencies",
    description: "Official government programs and agencies",
  },
  nonprofit: {
    id: "nonprofit",
    label: "Nonprofit Organizations",
    description: "Established nonprofit organizations",
  },
  coalition: {
    id: "coalition",
    label: "Networks & Coalitions",
    description: "Networks, coalitions, and alliances",
  },
  project: {
    id: "project",
    label: "Projects & Campaigns",
    description: "Time-bound initiatives and campaigns",
  },
  grassroots: {
    id: "grassroots",
    label: "Grassroots & Mutual Aid",
    description: "Informal groups and mutual aid networks",
  },
} as const;

export type DishesCategoryId = keyof typeof DISHES_CATEGORIES;

// Desserts categories: To get inspired
export const DESSERTS_CATEGORIES = {
  local: {
    id: "local",
    label: "Local Successes",
    description: "Baltimore/Maryland success stories",
  },
  elsewhere: {
    id: "elsewhere",
    label: "Examples from Elsewhere",
    description: "Success stories from other places",
  },
  "case-study": {
    id: "case-study",
    label: "Case Studies",
    description: "In-depth analysis of what worked",
  },
  media: {
    id: "media",
    label: "Media",
    description: "Articles, videos, podcasts, and more",
  },
} as const;

export type DessertsCategoryId = keyof typeof DESSERTS_CATEGORIES;

// Drinks categories: To express/discover needs
export const DRINKS_CATEGORIES = {
  urgent: {
    id: "urgent",
    label: "Urgent Needs",
    description: "Immediate, pressing needs",
  },
  ongoing: {
    id: "ongoing",
    label: "Ongoing Gaps",
    description: "Persistent gaps in resources or support",
  },
  idea: {
    id: "idea",
    label: "Ideas & Proposals",
    description: "Proposals and concepts needing support",
  },
} as const;

export type DrinksCategoryId = keyof typeof DRINKS_CATEGORIES;

// Bites categories: To take action
export const BITES_CATEGORIES = {
  research: {
    id: "research",
    label: "Research & Documentation",
    description: "Digging, writing, and documenting",
  },
  outreach: {
    id: "outreach",
    label: "Outreach",
    description: "Calling, canvassing, spreading the word",
  },
  "direct-support": {
    id: "direct-support",
    label: "Direct Support",
    description: "Accompaniment, translation, driving",
  },
  technical: {
    id: "technical",
    label: "Technical Work",
    description: "Design, web, and data work",
  },
  organizing: {
    id: "organizing",
    label: "Organizing",
    description: "Coordinating, planning, facilitating",
  },
  donation: {
    id: "donation",
    label: "Donations",
    description: "Money, goods, or space",
  },
} as const;

export type BitesCategoryId = keyof typeof BITES_CATEGORIES;

// Combined type for all category IDs
export type CategoryId =
  | SettingsCategoryId
  | DishesCategoryId
  | DessertsCategoryId
  | DrinksCategoryId
  | BitesCategoryId;

// Categories by collection
export const CATEGORIES: Record<
  PotluckCategory,
  Record<string, CategoryConfig>
> = {
  settings: SETTINGS_CATEGORIES,
  dishes: DISHES_CATEGORIES,
  desserts: DESSERTS_CATEGORIES,
  drinks: DRINKS_CATEGORIES,
  bites: BITES_CATEGORIES,
};

/**
 * Get category config by collection and category ID
 */
export function getCategoryConfig(
  collectionId: PotluckCategory,
  categoryId: string,
): CategoryConfig | undefined {
  return CATEGORIES[collectionId]?.[categoryId];
}

/**
 * Get all categories for a collection
 */
export function getCategoriesForCollection(
  collectionId: PotluckCategory,
): CategoryConfig[] {
  const categories = CATEGORIES[collectionId];
  return categories ? Object.values(categories) : [];
}

/**
 * Check if a category ID is valid for a collection
 */
export function isValidCategoryId(
  collectionId: PotluckCategory,
  categoryId: string,
): boolean {
  return !!CATEGORIES[collectionId]?.[categoryId];
}
