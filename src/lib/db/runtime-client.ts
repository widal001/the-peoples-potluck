/**
 * Runtime D1 client for SSR (Worker environment)
 * Uses the D1 binding provided by Cloudflare Workers
 */

import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "./schema";

export type Database = DrizzleD1Database<typeof schema>;

/**
 * Create a Drizzle client from a D1 binding
 * Use this in SSR contexts where env.DB is available
 */
export function createRuntimeClient(d1: D1Database): Database {
  return drizzle(d1, { schema });
}

/**
 * Type for the Cloudflare environment with D1 binding
 */
export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
}
