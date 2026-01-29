import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/migrations",
  dialect: "sqlite",
  // For local development, migrations are generated without DB connection
  // For drizzle-kit studio or push, set these env vars:
  //   CLOUDFLARE_ACCOUNT_ID, D1_DATABASE_ID, CLOUDFLARE_API_TOKEN
  ...(process.env.CLOUDFLARE_ACCOUNT_ID && {
    driver: "d1-http",
    dbCredentials: {
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
      databaseId: process.env.D1_DATABASE_ID!,
      token: process.env.CLOUDFLARE_API_TOKEN!,
    },
  }),
});
