/**
 * Astro-specific utilities for accessing D1 database
 * Provides helpers to get the database from Astro's runtime context
 */

import type { AstroGlobal } from "astro";
import { createRuntimeClient, type Database } from "./runtime-client";
import { createItemsService, type ItemsService } from "../services/items";

/**
 * Runtime type for Cloudflare environment in Astro
 */
interface CloudflareRuntime {
  env: {
    DB?: D1Database;
    ASSETS?: Fetcher;
  };
}

/**
 * Get the D1 database from Astro's runtime context
 * Returns undefined if not available (e.g., during static build without credentials)
 */
export function getD1FromAstro(
  astro: AstroGlobal,
): D1Database | undefined {
  const runtime = (astro.locals as { runtime?: CloudflareRuntime }).runtime;
  return runtime?.env?.DB;
}

/**
 * Get a Drizzle database client from Astro's runtime context
 * Returns undefined if D1 is not available
 */
export function getDatabaseFromAstro(
  astro: AstroGlobal,
): Database | undefined {
  const d1 = getD1FromAstro(astro);
  if (!d1) return undefined;
  return createRuntimeClient(d1);
}

/**
 * Get an ItemsService instance from Astro's runtime context
 * Returns undefined if D1 is not available
 */
export function getItemsServiceFromAstro(
  astro: AstroGlobal,
): ItemsService | undefined {
  const db = getDatabaseFromAstro(astro);
  if (!db) return undefined;
  return createItemsService(db);
}

/**
 * Check if the database is available in the current context
 */
export function isDatabaseAvailable(astro: AstroGlobal): boolean {
  return !!getD1FromAstro(astro);
}
