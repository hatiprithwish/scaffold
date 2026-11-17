import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// DEV_NOTE: drizzle-kit runs in Node, not through wrangler, so load apps/backend/.env ourselves.
// In CI the variables come from the environment and the file is absent.
if (existsSync(".env")) {
  process.loadEnvFile(".env");
}

// DEV_NOTE: `db:migrate:test` sets DRIZZLE_TARGET=test to migrate the Neon test branch used by vitest.
const url =
  process.env.DRIZZLE_TARGET === "test" ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;

export default defineConfig({
  schema: "./src/db/tables.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  // DEV_NOTE: Only `migrate` connects; `generate` works offline, so an empty url is fine there.
  dbCredentials: { url: url ?? "" },
});
