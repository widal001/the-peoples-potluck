/**
 * Database layer exports
 */

// Schema and types
export * from "./schema";

// Clients
export { createRuntimeClient, type Database, type Env } from "./runtime-client";
export { createBuildTimeClient, BuildTimeD1Client } from "./build-client";

// Astro integration
export {
  getD1FromAstro,
  getDatabaseFromAstro,
  getItemsServiceFromAstro,
  isDatabaseAvailable,
  type AstroContext,
} from "./astro-client";
