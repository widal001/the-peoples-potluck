/**
 * 32 Quiz Scenarios - 2 per archetype
 * Each describes a concrete organizing activity embodying the archetype's profile
 *
 * Axis meanings:
 * - Heat: Risk tolerance (controversial vs safe approaches)
 * - Sweet: Motivation (hope/joy vs frustration/anger)
 * - Zest: Visibility (front lines vs behind scenes)
 * - Heft: Time commitment (sustained vs short-term)
 */

import type { Scenario, ArchetypeId } from "./types";

// Scenarios organized by archetype ID
export const SCENARIOS_BY_ARCHETYPE: Record<ArchetypeId, [Scenario, Scenario]> =
  {
    // ============================================
    // HIGH HEAT (Spicy - High Risk Tolerance)
    // ============================================

    // HHHH: The Full Spread - Risky, hopeful, visible, sustained
    HHHH: [
      {
        id: "full-spread-1",
        archetypeId: "HHHH",
        title: "Lead a sanctuary movement",
        description:
          "Become a visible leader in a multi-year campaign to make your city a sanctuary, speaking at rallies, confronting officials, and building coalitions—knowing you'll face public criticism",
      },
      {
        id: "full-spread-2",
        archetypeId: "HHHH",
        title: "Build a community defense network",
        description:
          "Organize and publicly lead an ongoing rapid response network, training neighbors to protect families while celebrating the community you're building together",
      },
    ],

    // HHHL: Flash Sizzle - Risky, hopeful, visible, short-term
    HHHL: [
      {
        id: "flash-sizzle-1",
        archetypeId: "HHHL",
        title: "Organize a solidarity celebration",
        description:
          "Plan a high-profile public celebration of immigrant community members that makes a bold political statement, drawing media attention to joyful resistance",
      },
      {
        id: "flash-sizzle-2",
        archetypeId: "HHHL",
        title: "Lead a creative direct action",
        description:
          "Organize a visually striking one-time action—like a banner drop or flash mob—that captures public imagination and spreads hope while making a controversial statement",
      },
    ],

    // HHLH: Slow Burn - Risky, hopeful, behind-scenes, sustained
    HHLH: [
      {
        id: "slow-burn-1",
        archetypeId: "HHLH",
        title: "Run an underground support network",
        description:
          "Quietly coordinate an ongoing network helping families navigate risky situations, building deep trust over years while taking personal risks to protect others",
      },
      {
        id: "slow-burn-2",
        archetypeId: "HHLH",
        title: "Mentor emerging organizers",
        description:
          "Commit to long-term mentorship of new activists, helping them take strategic risks while keeping hope alive—even when progress feels slow",
      },
    ],

    // HHLL: Secret Spice - Risky, hopeful, behind-scenes, short-term
    HHLL: [
      {
        id: "secret-spice-1",
        archetypeId: "HHLL",
        title: "Provide emergency sanctuary",
        description:
          "Open your home as a temporary safe house when a family needs immediate refuge, taking real risk but keeping it quiet and time-limited",
      },
      {
        id: "secret-spice-2",
        archetypeId: "HHLL",
        title: "Fund bold actions anonymously",
        description:
          "Contribute resources to support high-risk organizing efforts, helping make courageous actions possible without needing recognition",
      },
    ],

    // HLHH: Fire Starter - Risky, justice-driven, visible, sustained
    HLHH: [
      {
        id: "fire-starter-1",
        archetypeId: "HLHH",
        title: "Lead an accountability campaign",
        description:
          "Publicly lead a sustained campaign holding local officials accountable for collaboration with ICE, organizing ongoing pressure and confrontation",
      },
      {
        id: "fire-starter-2",
        archetypeId: "HLHH",
        title: "Organize ongoing direct actions",
        description:
          "Coordinate regular public confrontations and protests, channeling community anger into visible, sustained pressure on those causing harm",
      },
    ],

    // HLHL: Hot Take - Risky, justice-driven, visible, short-term
    HLHL: [
      {
        id: "hot-take-1",
        archetypeId: "HLHL",
        title: "Confront officials publicly",
        description:
          "Show up at a public meeting to directly confront an official who's enabled deportations, making your anger visible and holding them accountable on the spot",
      },
      {
        id: "hot-take-2",
        archetypeId: "HLHL",
        title: "Organize emergency blockade",
        description:
          "Help coordinate a one-time direct action to physically intervene when ICE attempts a raid, putting yourself on the line to stop immediate harm",
      },
    ],

    // HLLH: Steady Flame - Risky, justice-driven, behind-scenes, sustained
    HLLH: [
      {
        id: "steady-flame-1",
        archetypeId: "HLLH",
        title: "Document abuses systematically",
        description:
          "Commit to ongoing, quiet documentation of immigration enforcement abuses, building evidence for accountability even when it puts you at risk",
      },
      {
        id: "steady-flame-2",
        archetypeId: "HLLH",
        title: "Run a court watch program",
        description:
          "Organize sustained court monitoring to document injustices, building long-term pressure through persistent witness without seeking media attention",
      },
    ],

    // HLLL: Quick Strike - Risky, justice-driven, behind-scenes, short-term
    HLLL: [
      {
        id: "quick-strike-1",
        archetypeId: "HLLL",
        title: "Provide tactical support",
        description:
          "Offer behind-the-scenes support for a specific direct action—driving, carrying supplies, or serving as lookout—taking risk without ongoing commitment",
      },
      {
        id: "quick-strike-2",
        archetypeId: "HLLL",
        title: "Disrupt a harmful process",
        description:
          "Take a one-time action to interfere with a deportation or harmful enforcement action, acting quickly and quietly when the moment demands it",
      },
    ],

    // ============================================
    // LOW HEAT (Mild - Lower Risk Tolerance)
    // ============================================

    // LHHH: Comfort Food - Safe, hopeful, visible, sustained
    LHHH: [
      {
        id: "comfort-food-1",
        archetypeId: "LHHH",
        title: "Build a welcome committee",
        description:
          "Create and lead an ongoing community welcome program for immigrant families, publicly celebrating new neighbors and building lasting connections",
      },
      {
        id: "comfort-food-2",
        archetypeId: "LHHH",
        title: "Organize cultural celebrations",
        description:
          "Coordinate regular public events celebrating immigrant community cultures, creating visible spaces of joy and belonging over the long term",
      },
    ],

    // LHHL: Sweet Greeting - Safe, hopeful, visible, short-term
    LHHL: [
      {
        id: "sweet-greeting-1",
        archetypeId: "LHHL",
        title: "Welcome newcomers at events",
        description:
          "Serve as a friendly, visible greeter at community gatherings, helping newcomers feel welcome and connected without long-term obligations",
      },
      {
        id: "sweet-greeting-2",
        archetypeId: "LHHL",
        title: "Host a community potluck",
        description:
          "Organize a one-time public gathering that brings people together around food and fellowship, creating a welcoming space for connection",
      },
    ],

    // LHLH: Soul Food - Safe, hopeful, behind-scenes, sustained
    LHLH: [
      {
        id: "soul-food-1",
        archetypeId: "LHLH",
        title: "Provide ongoing family support",
        description:
          "Build a long-term relationship with a family navigating immigration challenges, providing quiet, sustained emotional and practical support",
      },
      {
        id: "soul-food-2",
        archetypeId: "LHLH",
        title: "Coordinate mutual aid",
        description:
          "Quietly manage an ongoing mutual aid network, matching needs with resources and building deep community connections behind the scenes",
      },
    ],

    // LHLL: Little Something - Safe, hopeful, behind-scenes, short-term
    LHLL: [
      {
        id: "little-something-1",
        archetypeId: "LHLL",
        title: "Drop off supplies",
        description:
          "Contribute groceries, clothing, or other supplies when a family has a need—small acts of care that don't require ongoing commitment",
      },
      {
        id: "little-something-2",
        archetypeId: "LHLL",
        title: "Send encouraging messages",
        description:
          "Write supportive notes or make check-in calls to community members going through hard times, offering quiet kindness when you can",
      },
    ],

    // LLHH: Bread and Butter - Safe, justice-driven, visible, sustained
    LLHH: [
      {
        id: "bread-and-butter-1",
        archetypeId: "LLHH",
        title: "Build organizational systems",
        description:
          "Take on visible leadership of the practical infrastructure—managing communications, coordinating volunteers, keeping operations running for the long haul",
      },
      {
        id: "bread-and-butter-2",
        archetypeId: "LLHH",
        title: "Lead a worker center",
        description:
          "Help run an ongoing worker center or community organization, publicly coordinating the pragmatic work that makes advocacy possible",
      },
    ],

    // LLHL: Appetizer Plate - Safe, justice-driven, visible, short-term
    LLHL: [
      {
        id: "appetizer-plate-1",
        archetypeId: "LLHL",
        title: "Table at community events",
        description:
          "Staff an information table at public events, helping people learn about immigration issues and find ways to get involved",
      },
      {
        id: "appetizer-plate-2",
        archetypeId: "LLHL",
        title: "Lead a letter-writing session",
        description:
          "Organize a one-time public event where people can write letters to elected officials or detained immigrants—visible but low-barrier action",
      },
    ],

    // LLLH: Foundation Stock - Safe, justice-driven, behind-scenes, sustained
    LLLH: [
      {
        id: "foundation-stock-1",
        archetypeId: "LLLH",
        title: "Manage the database",
        description:
          "Take responsibility for maintaining member databases, contact lists, and organizational records—essential work that keeps everything running",
      },
      {
        id: "foundation-stock-2",
        archetypeId: "LLLH",
        title: "Handle ongoing admin",
        description:
          "Commit to the sustained administrative work—scheduling, correspondence, documentation—that organizations need but rarely celebrate",
      },
    ],

    // LLLL: Mise en Place - Safe, justice-driven, behind-scenes, short-term
    LLLL: [
      {
        id: "mise-en-place-1",
        archetypeId: "LLLL",
        title: "Set up for events",
        description:
          "Help with the practical preparation—setting up chairs, preparing materials, making copies—that makes events possible",
      },
      {
        id: "mise-en-place-2",
        archetypeId: "LLLL",
        title: "Research and fact-check",
        description:
          "Contribute by researching information, verifying facts, or gathering data that others will use in their advocacy work",
      },
    ],
  };

// Flatten to array for easy lookup
export const SCENARIOS: Scenario[] = Object.values(
  SCENARIOS_BY_ARCHETYPE,
).flat();
