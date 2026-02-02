/**
 * Astro-specific utilities for accessing D1 database
 * Provides helpers to get the database from Astro's runtime context
 */

import { createRuntimeClient, type Database } from "./runtime-client";
import { createItemsService, type ItemsService } from "../services/items";

/**
 * Minimal type for Astro context - avoids complex generic issues with AstroGlobal
 */
export interface AstroContext {
  locals: {
    runtime?: {
      env?: {
        DB?: D1Database;
        ASSETS?: Fetcher;
      };
    };
  };
}

/**
 * Get the D1 database from Astro's runtime context
 * Returns undefined if not available (e.g., during static build without credentials)
 */
export function getD1FromAstro(astro: AstroContext): D1Database | undefined {
  return astro.locals.runtime?.env?.DB;
}

/**
 * Get a Drizzle database client from Astro's runtime context
 * Returns undefined if D1 is not available
 */
export function getDatabaseFromAstro(astro: AstroContext): Database | undefined {
  const d1 = getD1FromAstro(astro);
  if (!d1) return undefined;
  return createRuntimeClient(d1);
}

/**
 * Get an ItemsService instance from Astro's runtime context
 * Returns undefined if D1 is not available
 */
export function getItemsServiceFromAstro(astro: AstroContext): ItemsService | undefined {
  const db = getDatabaseFromAstro(astro);
  if (!db) return undefined;
  return createItemsService(db);
}

/**
 * Check if the database is available in the current context
 */
export function isDatabaseAvailable(astro: AstroContext): boolean {
  return !!getD1FromAstro(astro);
}
