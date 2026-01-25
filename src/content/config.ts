import { defineCollection, z } from "astro:content";

const pages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lastUpdated: z.string().optional(),
  }),
});

const caseStudies = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.string(),
    client: z.string().optional(),
    industry: z.string().optional(),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().optional(),
  }),
});

// Flavor profile schema for filtering
// Each axis is a 1-5 scale representing different dimensions of the resource
const flavorProfileSchema = z.object({
  heat: z.number().min(1).max(5).optional(), // mild(1) ↔ spicy(5): risk, intensity
  sweet: z.number().min(1).max(5).optional(), // bitter(1) ↔ sweet(5): emotional register
  zest: z.number().min(1).max(5).optional(), // subtle(1) ↔ bold(5): visibility, presence
  heft: z.number().min(1).max(5).optional(), // light(1) ↔ hearty(5): time commitment
});

// Category options per collection - literal labels for usability

// Table Settings: To learn
const settingsCategorySchema = z
  .enum([
    "history", // Historical context, timelines
    "legislation", // Laws, policies, executive orders
    "data", // Demographics, statistics, research
    "rights", // Know your rights, legal tools
  ])
  .optional();

// Dishes: To get connected
const dishesCategorySchema = z
  .enum([
    "government", // Government agencies, official programs
    "nonprofit", // Established nonprofit organizations
    "coalition", // Networks, coalitions, alliances
    "project", // Time-bound initiatives, campaigns
    "grassroots", // Informal groups, mutual aid
  ])
  .optional();

// Desserts: To get inspired
const dessertsCategorySchema = z
  .enum([
    "local", // Baltimore/Maryland successes
    "elsewhere", // Examples from other places
    "case-study", // In-depth analysis of what worked
    "media", // Articles, videos, podcasts, etc.
  ])
  .optional();

// Drinks: To express/discover needs
const drinksCategorySchema = z
  .enum([
    "urgent", // Immediate, pressing needs
    "ongoing", // Persistent gaps in resources/support
    "idea", // Proposals and concepts needing support
  ])
  .optional();

// Sips & Bites: To take action (skills-based)
// Note: Bites use the standard relatedX fields to connect across all collections:
// - relatedSettings: "What you should know first" (context)
// - relatedDesserts: "Why this matters" (inspiration)
// - relatedDishes: "Who you'll be supporting" (connection)
// - relatedDrinks: "What need this addresses" (purpose)
const bitesCategorySchema = z
  .enum([
    "research", // Digging, writing, documenting
    "outreach", // Calling, canvassing, spreading word
    "direct-support", // Accompaniment, translation, driving
    "technical", // Design, web, data work
    "organizing", // Coordinating, planning, facilitating
    "donation", // Money, goods, space
  ])
  .optional();

// Base schema (shared fields for all potluck items)
const potluckBaseSchema = z.object({
  title: z.string(),
  description: z.string(),
  // Tags for filtering and display
  tags: z.array(z.string()).optional(),
  // Icon placeholder: base SVG name + two colors
  icon: z
    .object({
      svg: z.string(), // e.g., "coupe-glass", "fork", "plate"
      primaryColor: z.string(), // e.g., "red", "#ff0000"
      secondaryColor: z.string(), // e.g., "teal", "#00ffff"
    })
    .optional(),
  source: z.string().optional(), // Attribution
  sourceUrl: z.string().url().optional(), // Link to learn more
  addedDate: z.string().optional(),
  // Flavor profile for filtering by resource characteristics
  flavor: flavorProfileSchema.optional(),
  // Related content (slugs only, resolved at build time)
  relatedBites: z.array(z.string()).optional(),
  relatedDishes: z.array(z.string()).optional(),
  relatedDesserts: z.array(z.string()).optional(),
  relatedDrinks: z.array(z.string()).optional(),
  relatedSettings: z.array(z.string()).optional(),
});

// Collection-specific schemas with category fields

// Table Settings: To learn - History, legislation, and local context
const settingsSchema = potluckBaseSchema.extend({
  category: settingsCategorySchema,
});

// Dishes: To get connected - Organizations, coalitions, and initiatives
const dishesSchema = potluckBaseSchema.extend({
  category: dishesCategorySchema,
});

// Desserts: To get inspired - Successes, case studies, and stories
const dessertsSchema = potluckBaseSchema.extend({
  category: dessertsCategorySchema,
});

// Drinks: To express/discover needs - Gaps, needs, and ideas
const drinksSchema = potluckBaseSchema.extend({
  category: drinksCategorySchema,
});

// Sips & Bites: To take action - Specific ways to get involved
const bitesSchema = potluckBaseSchema.extend({
  category: bitesCategorySchema,
});

// Define collections
const settings = defineCollection({
  type: "content",
  schema: settingsSchema,
});

const dishes = defineCollection({
  type: "content",
  schema: dishesSchema,
});

const desserts = defineCollection({
  type: "content",
  schema: dessertsSchema,
});

const drinks = defineCollection({
  type: "content",
  schema: drinksSchema,
});

const bites = defineCollection({
  type: "content",
  schema: bitesSchema,
});

export const collections = {
  pages,
  "case-studies": caseStudies,
  settings,
  dishes,
  desserts,
  drinks,
  bites,
};
