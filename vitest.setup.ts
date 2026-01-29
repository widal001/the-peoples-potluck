import { beforeAll } from "vitest";
import { applyD1Migrations, env } from "cloudflare:test";

// Apply D1 migrations before all tests
// The TEST_MIGRATIONS binding is set in vitest.config.ts via readD1Migrations
beforeAll(async () => {
  await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
});
