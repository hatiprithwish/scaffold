# Claude Instructions

> Non-negotiable. Every session.

## Principles

- **Scan before code.** Read the closest golden file below before writing anything new. Mirror its naming, imports, and folder placement. No pre-existing pattern → flag it, don't assume.
- **Ambiguity halt.** Requirement unclear or conflicts with existing architecture → stop, ask one specific question. Don't guess.
- **No stubs.** No `// TODO`, placeholders, or partial features. Every delivered feature fetches, renders, errors, and empties end-to-end.
- **Multi-file features need a plan first.** Before writing code that touches >1 file, output: files to create/modify, golden file mirrored, new packages needed (if any — ask before adding), ambiguities. Wait for confirmation.
- **Ship complete.** All files in one response, fully wired — no "you'll need to connect this yourself."

### Golden files

| Layer               | File                                                 |
| ------------------- | ---------------------------------------------------- |
| DAL                 | `apps/backend/src/data-access-layer/NotesDAL.ts`     |
| Repository          | `apps/backend/src/repositories/NotesRepo.ts`         |
| Routes              | `apps/backend/src/routes/NotesRoutes.ts`             |
| Frontend data layer | `apps/web/src/routes/_authenticated/notes/-data.ts`  |
| Frontend page       | `apps/web/src/routes/_authenticated/notes/index.tsx` |
| Shared data layer   | `apps/web/src/data/index.ts`                         |
| Dropdown            | `apps/web/src/components/AppSelect.tsx`              |
| Date field          | `apps/web/src/components/AppDatePicker.tsx`          |
| Time field          | `apps/web/src/components/AppTimePicker.tsx`          |

## Stack

Monorepo (pnpm workspaces): `apps/web` (TanStack Start, React 19, Cloudflare Workers) · `apps/backend` (Hono, Drizzle, Neon Postgres via Cloudflare Hyperdrive) · `packages/schemas` (Zod schemas + types, source of truth for all types — never duplicate one in an app).

**Approved packages — don't introduce alternatives:** routing `@tanstack/react-router`+`react-start` · server state `@tanstack/react-query` · client state `zustand` · forms `@tanstack/react-form` (not react-hook-form) · validation `zod` v4 · UI `shadcn/ui` in `src/shadcn/ui/` + Tailwind v4 · calendar `react-day-picker` (only through shadcn's `Calendar`) · icons `@phosphor-icons/react` · auth `@clerk/tanstack-react-start` (web) / `@clerk/backend` (worker) · HTTP `hono` v4 + `@hono/zod-validator` · ORM `drizzle-orm` + `postgres` (postgres.js, `drizzle-orm/postgres-js`) through Hyperdrive → Neon · logging `@logtape/logtape` via `AppLogger` (never `console.log`) · errors Sentry · tests Vitest + RTL.

Before using any third-party API: check the installed version in `package.json`, read its file under `llm-context/`, and use context7 if still unclear. Never code against training-data memory of a library.

## New feature checklist

1. `packages/schemas/src/<feature>/` — `<Feature>Common.ts`, `ApiRequest.ts`, `ApiResponse.ts`, `DALRequest.ts`, `DALResponse.ts` (raw rows; the Repo maps them to the `ApiResponse` shapes), `index.ts`; export from `packages/schemas/src/index.ts`. Add `LogCategory`/`LogAction` entries in `log.ts`. Status fields get the Status Enum Pattern (below).
2. `apps/backend/src/db/tables.ts` — add the table (see DB Tables below), then `pnpm --filter backend db:generate` immediately, commit the migration with the schema change.
3. `data-access-layer/<Feature>DAL.ts` → `repositories/<Feature>Repo.ts` → `routes/<Feature>Routes.ts`, mounted in `apps/backend/src/index.ts`.
4. `apps/web/src/routes/_authenticated/<feature>/` — `-data.ts`, `index.tsx`, `new/index.tsx` and `$id/index.tsx` if applicable, `-Component.tsx` co-located (prefixed `-`).

**Layers never skip or reverse:** Routes → Repo → DAL → DB.

## Conventions

- **Status Enum Pattern** (any discrete-state field): DB stores int only. Define `<Feature>StatusIntEnum`, `<Feature>StatusLabelEnum`, `<FEATURE>_STATUS_LABEL_MAP` in `<Feature>Common.ts`. DAL returns raw int; Repo maps int→label in a private `withStatusLabel`; API response always carries both `<feature>Status` (int) and `<feature>StatusLabel` (string). See `NotesCommon.ts` / `NotesRepo.ts`.
- **Public ID Pattern** (every table): `id` (autoincrement int) is internal-only — joins/FKs, never sent to or accepted from a client. `publicId` (`Utility.generatePublicId()`, unique-indexed) is client-facing — every route param, API response, and frontend reference uses it instead. DAL generates it on insert and finds rows by it; API response types structurally omit `id` (`Omit<Note, "id">`). See `NotesCommon.ts` / `NotesDAL.ts` / `NotesRoutes.ts`.
- **DB tables**: `pgTable` aliased `table`; camelCase in code, `snake_case` in DB; `id` as `t.integer().primaryKey().generatedAlwaysAsIdentity()`; timestamps as `t.timestamp({ mode: "date", withTimezone: true })`; `createdAt` notNull + `updatedAt` nullable; index every FK; unique-index `publicId` and any other unique field.
- **DAL**: class holding `private db: DbClient`, ctor takes `env`. Postgres has no `.get()`. Destructure instead: `const [row] = await …returning()`. Every method inits `{ isSuccess: false }`, try/catch, `AppLogger.error` with `LogCategory`/`LogAction` on failure.
- **Repo**: thin — maps API shapes to DAL params, business logic lives here, not in DAL.
- **Routes**: `checkAuth` first, then `zValidator`. `c.get("clerkUserId")` for the user. 201/200/404/500.
- **Frontend `-data.ts`**: `Queries` class with hierarchical keys (`keys.all()` invalidates every detail). `setQueryData` on update, `removeQueries` on delete, `mutateAsync` when the caller must await, `mutate` otherwise. Every mutation needs a non-empty `onError` (toast).
- **Frontend pages**: `useAuth()` at page level, explicit loading/error states, all requests through `apiClient`.
- **Routes needing user data** live under `_authenticated/` — always.
- **Form controls look like the app, never the browser.** Every control is a shadcn component (`src/shadcn/ui/`) or one of our wrappers, themed by our tokens, the same on every OS. Production SaaS, not a browser default. `pnpm lint` refuses the native ones.
  - Dropdown → `AppSelect` (`apps/web/src/components/AppSelect.tsx`; plain `options`, full width, opens under the trigger). Menus of actions stay `DropdownMenu`.
  - Date → `AppDatePicker` (Popover + shadcn `Calendar`; value `"YYYY-MM-DD"`, `""` = none; pass the server's `today`).
  - Time → `AppTimePicker` (`AppSelect` over 15-minute slots; value `"HH:mm"`).
  - Radio / checkbox → a styled `<label>` around an `sr-only` input; number → `Input type="number"` (the web stylesheet hides the OS spinner); file → a `Button` that opens an `sr-only` `<input type="file">`; confirmations → a `Dialog` or a toast.
  - No shadcn component and no wrapper for what you need → add it from shadcn (`pnpm exec shadcn add <name>` in `apps/web`) and wrap it in `apps/web/src/components/App<Name>.tsx`; ask first if it needs a new package.
- **Shared frontend data** (`apps/web/src/data/index.ts`): queries and mutations used by more than one route or by the app shell (the signed-in user) live here, not in one route's `-data.ts`. Same shape as `-data.ts` (a `Queries` class with hierarchical keys, hooks, non-empty `onError`). A route's own data stays in its `-data.ts`.
- **Styling**: Tailwind only, shadcn used as-is or via `className` (never edit `src/shadcn/ui/`), no CSS modules.

## Hard bans

- A browser-default control: `<select>`, `<input type="date" | "time" | "datetime-local" | "month" | "week" | "color">`, a visible native checkbox / radio / file input, or `alert` / `confirm` / `prompt` (use `AppSelect`, `AppDatePicker`, `AppTimePicker`, a `Dialog`, a toast)
- `console.log`, `any`, `@ts-ignore`/`as any` as a fix
- Types or Zod schemas defined outside `packages/schemas`
- Skipping a layer, or an authenticated route outside `_authenticated/`
- A client-supplied `id`, or an internal `id` in any response/param — `publicId` only
- Installing a package without asking, or one with a native browser API equivalent
- Disabling an ESLint rule inline without asking
- A schema change without immediately running `db:generate`
- A mutation with an absent or empty `onError`
- `npm`/`yarn` — `pnpm` always

## Commands

```bash
pnpm dev                          # run all apps
pnpm lint                         # eslint, every package (pre-commit)
pnpm typecheck                    # tsc --noEmit, every package (pre-commit)
pnpm --filter web dev
pnpm --filter backend dev
pnpm --filter backend secret:put <NAME> --env staging  # set a Worker secret from anywhere in the repo (wrangler needs apps/backend)
pnpm --filter web test
pnpm --filter backend test            # needs TEST_DATABASE_URL in apps/backend/.env
pnpm --filter backend db:generate     # generate migration after schema change
pnpm --filter backend db:migrate      # apply migrations to DATABASE_URL (Neon)
pnpm --filter backend db:migrate:test # apply migrations to TEST_DATABASE_URL (Neon test branch)
```

---

> Scan. Verify. Plan. Implement completely. The repo is the source of truth over training memory.
