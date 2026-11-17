import { cloudflareTest } from "@cloudflare/vitest-pool-workers";
import { defineConfig } from "vitest/config";
import { existsSync } from "fs";
import path from "path";

const envFile = path.resolve(import.meta.dirname, ".env");
if (existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

const testDatabaseUrl = process.env.TEST_DATABASE_URL;
if (!testDatabaseUrl) {
  throw new Error(
    "TEST_DATABASE_URL is not set. Add a Neon test-branch connection string to apps/backend/.env (see .env.example).",
  );
}
// DEV_NOTE: wrangler reads this to point the HYPERDRIVE binding at a real Postgres when running locally.
process.env.CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE = testDatabaseUrl;

export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: "./wrangler.jsonc" },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@app/schemas": path.resolve(import.meta.dirname, "../../packages/schemas/src/index.ts"),
    },
  },
  test: {
    include: ["src/**/*.{test,spec}.ts"],
  },
});
