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

// Shared schema for potluck items
const potluckItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  // Tags for filtering and display (like Skip the Bow's tag pills)
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
});

// Side Dishes: Existing Baltimore groups/efforts related to immigrant solidarity
const sideDishes = defineCollection({
  type: "content",
  schema: potluckItemSchema,
});

// Desserts: Hopeful initiatives giving hope for community safety
const desserts = defineCollection({
  type: "content",
  schema: potluckItemSchema,
});

// Plates & Cutlery: Local historical context about ICE/policing/immigration
const platesCutlery = defineCollection({
  type: "content",
  schema: potluckItemSchema,
});

// Drinks: What Baltimore is thirsty for in organizing/mutual aid
const drinks = defineCollection({
  type: "content",
  schema: potluckItemSchema,
});

export const collections = {
  pages,
  "case-studies": caseStudies,
  "side-dishes": sideDishes,
  desserts,
  "plates-cutlery": platesCutlery,
  drinks,
};
