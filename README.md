## Setup

### Prerequisites

- Node.js 20+
- pnpm
- Cloudflare account + Wrangler CLI (`pnpm i -g wrangler`)
- Clerk account

### Frontend (`apps/web`)

- Copy `apps/web/wrangler.jsonc` and set `VITE_API_URL` to your worker's local or deployed URL
- Add Clerk secrets via `wrangler secret put CLERK_PUBLISHABLE_KEY` (or set in Cloudflare dashboard for deployed envs)
- `pnpm --filter web dev` — starts dev server on `localhost:3000`

### Backend (`apps/worker`)

- Create a D1 database: `wrangler d1 create scaffold-db`
- Update `database_id` in `apps/worker/wrangler.jsonc` with the returned ID
- Add secrets:
  - `wrangler secret put CLERK_PUBLISHABLE_KEY`
  - `wrangler secret put CLERK_SECRET_KEY`
- Run migrations: `pnpm --filter worker db:migrate:local`
- `pnpm --filter worker dev` — starts API on `localhost:8787`

### Run everything

```bash
pnpm install
pnpm dev
```

---

## Tech Stack

- TanStack Start
- Zustand — Lightweight client state management
- tanstack query — Server state & data fetching
- tanstack form — Form state management
- Tailwind CSS — Utility-first CSS framework
- shadcn — Component library (Radix UI + Tailwind)
- Class Variance Authority — CSS variant utility
- clsx — Conditional CSS class utility
- tailwind-merge — Merges Tailwind classes intelligently
- tw-animate-css — Tailwind animation utilities
- @phosphor-icons/react — Icon library
- react-hook-form — Form handling 
- @hookform/resolvers — RHF validation resolvers
- Zod — Schema validation & TypeScript types
- @dnd-kit/core — Headless drag-and-drop
- @dnd-kit/sortable — Sortable addon for dnd-kit
- @dnd-kit/utilities — dnd-kit utilities
- @clerk/tanstack-react-start — Clerk auth for TanStack Start
- sonner — Toast notification library
- @sentry/tanstackstart-react — Sentry error tracking
- Cloudflare Workers — Runtime environment
- wrangler — Cloudflare CLI tool
- Vitest — Unit & component testing
- ESLint — Linting
- TypeScript — Type system
- @vitejs/plugin-react — Vite React plugin
- eslint-plugin-react-hooks — React hooks linting
- eslint-plugin-react-x — React best practices linting
- Hono — Lightweight web framework (Cloudflare Workers compatible)
- Cloudflare Workers — Serverless runtime
- wrangler — Cloudflare CLI & local dev server
- Drizzle ORM — Type-safe ORM for D1 (SQLite)
- drizzle-kit — Schema generation & migration tools
- Cloudflare D1 — Serverless SQLite database
- @hono/zod-validator — Zod schema validator middleware for Hono
- @clerk/backend — Clerk backend SDK for token verification
- @logtape/logtape — Structured logging
- @logtape/hono — Hono integration for LogTape
- @logtape/redaction — Sensitive data redaction
- @cloudflare/vitest-pool-workers — Vitest pool for Cloudflare Workers
- typescript-eslint — TypeScript linting
- Prettier — Code formatter
- eslint-config-prettier — Disables conflicting ESLint rules
- Husky — Git hook runner
- lint-staged — Run linters on staged files
