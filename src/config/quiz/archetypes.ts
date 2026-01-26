/**
 * The 16 flavor profile archetypes
 * Each represents a unique combination of high/low on four axes:
 * Heat (risk tolerance), Sweet (motivation), Zest (visibility), Heft (commitment)
 */

import type { Archetype, ArchetypeId } from "./types";

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  // ============================================
  // HIGH HEAT PROFILES (Spicy - High Risk Tolerance)
  // ============================================

  HHHH: {
    id: "HHHH",
    slug: "the-full-spread",
    label: "The Full Spread",
    tagline: "All-in engagement that leaves nothing on the table",
    description:
      "You're drawn to the most complete form of engagement—visible, bold, sustained, and driven by hope. You want to be on the front lines building something beautiful for the long haul, even when it means taking real risks. Your activism is about creating the world you want to see while being willing to put yourself out there to make it happen.",
    profile: { heat: "high", sweet: "high", zest: "high", heft: "high" },
    strengths: [
      "Leading visible, long-term campaigns",
      "Inspiring others through bold vision",
      "Building lasting community institutions",
      "Taking strategic risks for big wins",
    ],
    complementaryIds: ["LLLL", "LHLH", "HLHL"],
    suggestedCategories: ["heat", "zest"],
  },

  HHHL: {
    id: "HHHL",
    slug: "flash-sizzle",
    label: "Flash Sizzle",
    tagline: "Quick, bold actions that spark momentum",
    description:
      "You bring high-energy, visible bursts of hopeful action. You're willing to take risks and be seen, but you prefer targeted interventions over long-term commitments. Your superpower is creating moments that shift the narrative and inspire others to join in.",
    profile: { heat: "high", sweet: "high", zest: "high", heft: "low" },
    strengths: [
      "Creating viral moments",
      "Energizing crowds at rallies",
      "Quick-response media engagement",
      "Sparking enthusiasm in newcomers",
    ],
    complementaryIds: ["LLLH", "HHLH", "LLHL"],
    suggestedCategories: ["heat", "zest"],
  },

  HHLH: {
    id: "HHLH",
    slug: "slow-burn",
    label: "Slow Burn",
    tagline: "Deep, quiet intensity with sustained care",
    description:
      "You combine a willingness to take risks with a preference for working behind the scenes over the long haul. Motivated by hope and vision, you're the steady force that keeps movements going when the spotlight fades. You build deep relationships and aren't afraid to push boundaries quietly.",
    profile: { heat: "high", sweet: "high", zest: "low", heft: "high" },
    strengths: [
      "Long-term relationship building",
      "Sustained behind-scenes organizing",
      "Mentoring new activists",
      "Strategic risk assessment",
    ],
    complementaryIds: ["LLHL", "HHHL", "LHLH"],
    suggestedCategories: ["heft", "sweet"],
  },

  HHLL: {
    id: "HHLL",
    slug: "secret-spice",
    label: "Secret Spice",
    tagline: "Behind-the-scenes warmth with tactical heat",
    description:
      "You're willing to take risks and are motivated by hope, but prefer to work quietly with flexible time commitments. You're the person who makes bold things happen without needing credit, contributing crucial support when it matters most.",
    profile: { heat: "high", sweet: "high", zest: "low", heft: "low" },
    strengths: [
      "Anonymous support for high-risk actions",
      "Flexible emergency response",
      "Quiet acts of courage",
      "Supporting others to take the spotlight",
    ],
    complementaryIds: ["LLHH", "HLHH", "LHLL"],
    suggestedCategories: ["heat", "sweet"],
  },

  HLHH: {
    id: "HLHH",
    slug: "fire-starter",
    label: "Fire Starter",
    tagline: "Confrontational, visible, committed organizing",
    description:
      "You're driven by righteous anger at injustice and willing to take it public for the long haul. You confront systems directly, lead visible campaigns, and commit deeply to the fight. Your passion for accountability fuels sustained, bold action.",
    profile: { heat: "high", sweet: "low", zest: "high", heft: "high" },
    strengths: [
      "Leading direct action campaigns",
      "Public accountability work",
      "Sustained pressure tactics",
      "Mobilizing around injustice",
    ],
    complementaryIds: ["LHLL", "HHHH", "LLHL"],
    suggestedCategories: ["heat", "zest"],
  },

  HLHL: {
    id: "HLHL",
    slug: "hot-take",
    label: "Hot Take",
    tagline: "Bold rapid response and direct action",
    description:
      "You're ready to confront injustice publicly and immediately. Driven by anger at what's wrong, you excel at visible, high-impact interventions that don't require long-term commitment. You show up when it counts and aren't afraid to be controversial.",
    profile: { heat: "high", sweet: "low", zest: "high", heft: "low" },
    strengths: [
      "Rapid response actions",
      "Media-ready confrontations",
      "Emergency mobilization",
      "High-impact one-time events",
    ],
    complementaryIds: ["LHLH", "HHHH", "LLLH"],
    suggestedCategories: ["heat", "zest"],
  },

  HLLH: {
    id: "HLLH",
    slug: "steady-flame",
    label: "Steady Flame",
    tagline: "Sustained pressure through quiet persistence",
    description:
      "You're in it for the long haul, working behind the scenes with a willingness to take risks when necessary. Fueled by frustration with injustice, you apply steady pressure without seeking the spotlight. You're the backbone of sustained resistance.",
    profile: { heat: "high", sweet: "low", zest: "low", heft: "high" },
    strengths: [
      "Long-term watchdog efforts",
      "Quiet resistance networks",
      "Persistent documentation",
      "Underground support systems",
    ],
    complementaryIds: ["LHHL", "HLHL", "LLHH"],
    suggestedCategories: ["heat", "heft"],
  },

  HLLL: {
    id: "HLLL",
    slug: "quick-strike",
    label: "Quick Strike",
    tagline: "Efficient tactical interventions",
    description:
      "You're willing to take risks and act on your frustration with injustice, but prefer targeted, behind-the-scenes actions that don't require ongoing commitment. You're strategic, efficient, and effective when the moment calls for bold action.",
    profile: { heat: "high", sweet: "low", zest: "low", heft: "low" },
    strengths: [
      "Strategic one-time interventions",
      "Anonymous direct action support",
      "Tactical disruption",
      "High-impact minimal footprint",
    ],
    complementaryIds: ["LHHH", "HLLH", "LLHL"],
    suggestedCategories: ["heat"],
  },

  // ============================================
  // LOW HEAT PROFILES (Mild - Lower Risk Tolerance)
  // ============================================

  LHHH: {
    id: "LHHH",
    slug: "comfort-food",
    label: "Comfort Food",
    tagline: "Welcoming, visible, sustained community building",
    description:
      "You create spaces where everyone belongs. Working publicly and for the long term, you're motivated by hope and the joy of building community. You prefer approaches that bring people together rather than confrontation, creating lasting structures of mutual support.",
    profile: { heat: "low", sweet: "high", zest: "high", heft: "high" },
    strengths: [
      "Building welcoming community spaces",
      "Long-term mutual aid leadership",
      "Public celebration and culture",
      "Sustained relationship networks",
    ],
    complementaryIds: ["HLLL", "LLLL", "HHHH"],
    suggestedCategories: ["sweet", "zest"],
  },

  LHHL: {
    id: "LHHL",
    slug: "sweet-greeting",
    label: "Sweet Greeting",
    tagline: "Accessible entry points with visible warmth",
    description:
      "You're the welcoming face that brings people into the movement. Publicly hopeful and optimistic, you create low-barrier ways for newcomers to participate. You don't need confrontation or long commitments—just genuine connection and joy.",
    profile: { heat: "low", sweet: "high", zest: "high", heft: "low" },
    strengths: [
      "Welcoming newcomers",
      "Public-facing hospitality",
      "Event greeting and orientation",
      "Creating accessible entry points",
    ],
    complementaryIds: ["HLLH", "LHHH", "HHHL"],
    suggestedCategories: ["sweet", "zest"],
  },

  LHLH: {
    id: "LHLH",
    slug: "soul-food",
    label: "Soul Food",
    tagline: "Deep nurturing through quiet, sustained care",
    description:
      "You provide the deep, ongoing care that sustains communities through hard times. Working behind the scenes with hope and love, you build lasting relationships without seeking visibility or taking big risks. You're the heart that keeps beating.",
    profile: { heat: "low", sweet: "high", zest: "low", heft: "high" },
    strengths: [
      "Long-term emotional support",
      "Quiet caregiving networks",
      "Sustained mutual aid",
      "Deep community relationships",
    ],
    complementaryIds: ["HLHL", "HHHH", "LLHL"],
    suggestedCategories: ["sweet", "heft"],
  },

  LHLL: {
    id: "LHLL",
    slug: "little-something",
    label: "Little Something",
    tagline: "Small acts of care that add up",
    description:
      "You contribute through quiet, hopeful gestures that don't require big commitments or public visibility. You know that small acts of kindness and support accumulate into real change. Every little bit matters, and you show up when you can.",
    profile: { heat: "low", sweet: "high", zest: "low", heft: "low" },
    strengths: [
      "Consistent small contributions",
      "Behind-scenes support tasks",
      "Quiet acts of kindness",
      "Flexible helping hands",
    ],
    complementaryIds: ["HLHH", "LHLH", "HHLL"],
    suggestedCategories: ["sweet"],
  },

  LLHH: {
    id: "LLHH",
    slug: "bread-and-butter",
    label: "Bread and Butter",
    tagline: "Pragmatic, visible, committed infrastructure",
    description:
      "You focus on building the essential infrastructure that movements need. Motivated by a clear-eyed view of what's wrong, you work publicly and for the long term on the practical systems that make everything else possible. You're not about flash—you're about function.",
    profile: { heat: "low", sweet: "low", zest: "high", heft: "high" },
    strengths: [
      "Building lasting organizations",
      "Public-facing operations",
      "Long-term systems development",
      "Visible leadership on logistics",
    ],
    complementaryIds: ["HHLL", "HLHH", "LHHH"],
    suggestedCategories: ["zest", "heft"],
  },

  LLHL: {
    id: "LLHL",
    slug: "appetizer-plate",
    label: "Appetizer Plate",
    tagline: "Accessible, visible introductory engagement",
    description:
      "You help people find their way into the work through visible, low-commitment activities. Pragmatic about what needs to happen, you create public entry points that don't require big risks or long-term promises. You meet people where they are.",
    profile: { heat: "low", sweet: "low", zest: "high", heft: "low" },
    strengths: [
      "Creating accessible actions",
      "Public awareness campaigns",
      "Low-barrier volunteer coordination",
      "Visible but safe engagement",
    ],
    complementaryIds: ["HHLH", "LLHH", "HHHL"],
    suggestedCategories: ["zest"],
  },

  LLLH: {
    id: "LLLH",
    slug: "foundation-stock",
    label: "Foundation Stock",
    tagline: "Behind-the-scenes infrastructure building",
    description:
      "You're the essential foundation that holds everything together. Working quietly for the long term, you build the systems and processes that movements depend on. You don't need recognition—you need the work to get done right.",
    profile: { heat: "low", sweet: "low", zest: "low", heft: "high" },
    strengths: [
      "Database and systems management",
      "Long-term administrative support",
      "Quiet operational leadership",
      "Sustained behind-scenes work",
    ],
    complementaryIds: ["HHHL", "HLLH", "LHHH"],
    suggestedCategories: ["heft"],
  },

  LLLL: {
    id: "LLLL",
    slug: "mise-en-place",
    label: "Mise en Place",
    tagline: "Precise preparation that enables others",
    description:
      "You make sure everything is ready for others to do their work. Preferring low-risk, behind-the-scenes tasks with flexible time, you handle the essential preparation that makes actions possible. When everything goes smoothly, it's often because of you.",
    profile: { heat: "low", sweet: "low", zest: "low", heft: "low" },
    strengths: [
      "Event preparation and setup",
      "Research and fact-checking",
      "Materials preparation",
      "Quiet support tasks",
    ],
    complementaryIds: ["HHHH", "LHHH", "HLHH"],
    suggestedCategories: [],
  },
};

// Grouping labels for results page
export const AXIS_GROUP_LABELS = {
  heat: {
    high: "Spicy Engagement",
    low: "Mild Engagement",
  },
  sweet: {
    high: "Hope-Driven",
    low: "Justice-Driven",
  },
  zest: {
    high: "Front Lines",
    low: "Behind the Scenes",
  },
  heft: {
    high: "Deep Commitment",
    low: "Flexible Involvement",
  },
};
