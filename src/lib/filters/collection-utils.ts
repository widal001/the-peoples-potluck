/**
 * Utilities for transforming Astro collection entries to PotluckItem format
 */

import type { CollectionEntry } from "astro:content";
import type { PotluckItem, PotluckCategory } from "./types";

/**
 * Map an Astro collection entry to a PotluckItem
 */
export function collectionEntryToItem(
  entry: CollectionEntry<PotluckCategory>,
): PotluckItem {
  return {
    slug: entry.slug,
    title: entry.data.title,
    description: entry.data.description,
    tags: entry.data.tags || [],
    icon: entry.data.icon,
    flavor: entry.data.flavor || {},
  };
}

/**
 * Sort comparator for collection entries by addedDate (newest first)
 */
export function sortByDateDesc<T extends { data: { addedDate?: string } }>(
  a: T,
  b: T,
): number {
  const dateA = a.data.addedDate ? new Date(a.data.addedDate).getTime() : 0;
  const dateB = b.data.addedDate ? new Date(b.data.addedDate).getTime() : 0;
  return dateB - dateA;
}

/**
 * Prepare collection entries for display: sort by date and convert to PotluckItem
 */
export function prepareCollectionItems(
  entries: CollectionEntry<PotluckCategory>[],
): PotluckItem[] {
  return entries.sort(sortByDateDesc).map(collectionEntryToItem);
}
