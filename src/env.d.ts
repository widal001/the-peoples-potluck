/// <reference types="@cloudflare/vitest-pool-workers" />

// Extend the cloudflare:test module with our custom bindings
declare module "cloudflare:test" {
  interface ProvidedEnv {
    DB: D1Database;
    TEST_MIGRATIONS: D1Migration[];
  }
}

// D1 migration type from @cloudflare/vitest-pool-workers
interface D1Migration {
  name: string;
  queries: string[];
}
