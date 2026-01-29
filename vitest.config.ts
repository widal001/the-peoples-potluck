import path from "node:path";
import {
  defineWorkersConfig,
  readD1Migrations,
} from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig(async () => {
  // Read D1 migrations from the Drizzle migrations folder
  const migrationsPath = path.join(__dirname, "src/lib/db/migrations");
  const migrations = await readD1Migrations(migrationsPath);

  return {
    test: {
      globals: true,
      setupFiles: ["./vitest.setup.ts"],
      poolOptions: {
        workers: {
          wrangler: { configPath: "./wrangler.jsonc" },
          miniflare: {
            d1Databases: ["DB"],
            // Pass migrations as a binding so setup file can apply them
            bindings: { TEST_MIGRATIONS: migrations },
          },
        },
      },
    },
  };
});
