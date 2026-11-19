import { defineConfig, loadEnv } from "vite";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { sentryTanstackStart } from "@sentry/tanstackstart-react/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      cloudflare({ viteEnvironment: { name: "ssr" } }),
      tanstackStart(),
      sentryTanstackStart({
        org: env.SENTRY_ORG,
        project: env.SENTRY_PROJECT,
        authToken: env.SENTRY_AUTH_TOKEN,
        // The server SDK isn't initialised on Workers (instrument.server.mjs only loads via Node's
        // --import), so the tunnel can't derive the DSN at runtime. Pass it at build time.
        tunnelRoute: env.VITE_SENTRY_DSN ? { allowedDsns: [env.VITE_SENTRY_DSN] } : true,
      }),
      viteReact(),
      tailwindcss(),
    ],
    server: {
      port: 3000,
    },
    resolve: {
      tsconfigPaths: true,
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@app/schemas": path.resolve(__dirname, "../../packages/schemas/src/index.ts"),
      },
    },
  };
});
