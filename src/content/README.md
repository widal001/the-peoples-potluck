# Content Collections

This document describes the content collections used in Ice Potluck, a community resource for immigrant solidarity in Baltimore.

## Overview

The site uses a "potluck" metaphor to organize different types of resources. Each collection serves a distinct purpose, helping visitors find what they need based on their mindset.

| Collection         | Purpose                   | Visitor Mindset                         |
| ------------------ | ------------------------- | --------------------------------------- |
| **Table Settings** | To learn                  | "I want to understand the landscape"    |
| **Dishes**         | To get connected          | "I want to find people doing this work" |
| **Desserts**       | To get inspired           | "I want to see what's possible"         |
| **Drinks**         | To express/discover needs | "I want to name what's missing"         |
| **Sips & Bites**   | To take action            | "I want to do something now"            |

## Collections

### Table Settings (`/settings/`)

**Purpose:** To learn

**Tagline:** "Before we eat"

**Description:** Understand the landscape. History, legislation, and local context that shapes the immigrant experience in Baltimore.

**Subcategories:**
- `history` — Historical context, timelines, how we got here
- `legislation` — Laws, policies, executive orders
- `data` — Demographics, statistics, research
- `rights` — Know your rights, legal tools and resources

---

### Dishes (`/dishes/`)

**Purpose:** To get connected

**Tagline:** "What's on the table"

**Description:** Find your people. Organizations, coalitions, and initiatives doing the work in our community.

**Subcategories:**
- `government` — Government agencies, official programs
- `nonprofit` — Established nonprofit organizations
- `coalition` — Networks, coalitions, alliances
- `project` — Time-bound initiatives, campaigns
- `grassroots` — Informal groups, mutual aid efforts

---

### Desserts (`/desserts/`)

**Purpose:** To get inspired

**Tagline:** "Worth saving room for"

**Description:** See what's possible. Successes, case studies, and stories that show what community power can do.

**Subcategories:**
- `local` — Baltimore/Maryland successes
- `elsewhere` — Examples from other places
- `case-study` — In-depth analysis of what worked
- `media` — Articles, videos, podcasts, documentaries

---

### Drinks (`/drinks/`)

**Purpose:** To express/discover needs

**Tagline:** "What we're thirsting for"

**Description:** Name what's missing. Gaps, needs, and ideas that are waiting for support.

**Subcategories:**
- `urgent` — Immediate, pressing needs
- `ongoing` — Persistent gaps in resources or support
- `idea` — Proposals and concepts needing support

---

### Sips & Bites (`/bites/`)

**Purpose:** To take action

**Tagline:** "Dig in"

**Description:** Do something today. Specific ways to get involved based on your skills and availability.

The name "Sips & Bites" reflects that actions can support both Dishes (ongoing initiatives) and Drinks (unmet needs). Both are small, approachable, and satisfying.

**Subcategories (skills-based):**
- `research` — Digging, writing, documenting
- `outreach` — Calling, canvassing, spreading the word
- `direct-support` — Accompaniment, translation, driving
- `technical` — Design, web, data work
- `organizing` — Coordinating, planning, facilitating
- `donation` — Money, goods, space

---

## Flavor Profiles

All collections share a "flavor profile" system that helps visitors find resources matching their comfort level and capacity. Each dimension is rated 1-5:

| Dimension | Low (1) | High (5) | What it measures                     |
| --------- | ------- | -------- | ------------------------------------ |
| **Heat**  | Mild    | Spicy    | Risk, intensity, confrontation level |
| **Sweet** | Bitter  | Sweet    | Emotional register, hopefulness      |
| **Zest**  | Subtle  | Bold     | Visibility, public presence          |
| **Heft**  | Light   | Hearty   | Time commitment required             |

## Content Schema

Each content item includes:

```yaml
---
title: "Required title"
description: "Required description"
category: "subcategory-slug"  # From the options above
tags: ["optional", "array", "of", "tags"]
icon:
  svg: "icon-name"
  primaryColor: "#hex"
  secondaryColor: "#hex"
source: "Attribution (optional)"
sourceUrl: "https://example.com (optional)"
addedDate: "2025-01-24"
flavor:
  heat: 3
  sweet: 4
  zest: 2
  heft: 3
# Related content (optional)
relatedBites: ["slug-1", "slug-2"]
relatedDishes: ["slug-1"]
relatedDesserts: []
relatedDrinks: []
relatedSettings: []
---

Content body in MDX format...
```

### Bites: The Connective Tissue

Bites are unique because they integrate all other collections. While other collections use `relatedX` fields to suggest "you might also like," Bites use them to show how the action connects across the potluck:

| Field             | For Bites, it means...                                     |
| ----------------- | ---------------------------------------------------------- |
| `relatedSettings` | "What you should know first" — context and knowledge       |
| `relatedDesserts` | "Why this matters" — inspiration and examples              |
| `relatedDishes`   | "Who you'll be supporting" — organizations and initiatives |
| `relatedDrinks`   | "What need this addresses" — the gap being filled          |

Example bite that ties everything together:

```yaml
---
title: "Volunteer for ICE Court Watch"
description: "Observe immigration court proceedings and document what you see."
category: "direct-support"
relatedSettings: ["know-your-rights-history"]  # Context to understand first
relatedDesserts: ["ice-court-watch-success"]   # Example of impact elsewhere
relatedDishes: ["ice-court-watch"]             # The org running this
relatedDrinks: ["court-transparency-gap"]      # The need this addresses
---
```

## Contributing Content

1. Choose the appropriate collection based on the content's purpose
2. Select the most fitting subcategory
3. Assign a flavor profile that honestly reflects the resource
4. Add relevant tags for discoverability
5. Link related content across collections where helpful

---

## Design Notes: Naming Considerations

We aimed for collection names that are:
- Clear about purpose (visitors know why they're going there)
- Playful but not "too clever" (the metaphor shouldn't require translation)
- Warm and inviting (aligned with "Make me a plate")

**Alternative names we considered for the action collection:**

| Name     | Pros                                | Cons                                   |
| -------- | ----------------------------------- | -------------------------------------- |
| Bites    | Active, "bite-sized" = approachable | Doesn't obviously connect to Drinks    |
| Tastes   | Works for food AND drinks           | Feels like consuming, not contributing |
| Helpings | Has "help" in it                    | As a noun, implies receiving           |
| Servings | "Serve" = giving                    | Less snappy                            |
| Shares   | "Do your share" = contributing      | Less food-specific                     |

We landed on **"Sips & Bites"** because it explicitly bridges both Dishes and Drinks while keeping the approachable, bite-sized quality.

**Subcategory philosophy:**

We use literal labels for subcategories (e.g., "nonprofit" not "main course") so visitors don't need to learn a translation layer. The metaphor lives at the collection level; the filters are practical.
