# AGENTS.md

This file provides context for AI agents and automated tools working on this codebase.

## Project Overview

**Personal Finance Tools** is a web application that provides calculators and analysis tools for personal finance — investment returns, mutual fund analysis, and Indian income tax (ITR) schedule generation. It is deployed on Vercel and targets the Indian financial context primarily.

## Tech Stack

| Layer         | Technology                                                        |
| ------------- | ----------------------------------------------------------------- |
| Framework     | TanStack Start (SSR/SSG via Vite + Nitro)                         |
| UI Library    | React 19                                                          |
| Routing       | TanStack Router (file-based, `src/routes/`)                       |
| Data Fetching | TanStack Query (persisted to localStorage)                        |
| Styling       | Tailwind CSS v4 (via `@tailwindcss/vite`)                         |
| Components    | shadcn/ui (Base UI variant) + Lucide icons                        |
| Charts        | Recharts                                                          |
| Forms         | React Hook Form + Zod validation                                  |
| Linting       | Biome (linter + formatter)                                        |
| Language      | TypeScript (strict mode)                                          |
| Deployment    | Vercel (only `main` branch + PRs deploy)                          |
| Server        | Nitro (server functions in `src/features/*/server/`)              |

## Repository Structure

```
src/
├── components/          # Shared UI components
│   ├── ui/              # shadcn/ui primitives (button, card, sidebar, etc.)
│   ├── providers.tsx    # QueryClient + SidebarProvider wrapper
│   └── ...              # App-level shared components
├── features/            # Feature modules (domain logic + UI)
│   ├── calculators/     # FD, RD, SIP, SWP calculators
│   │   ├── components/
│   │   ├── hooks/
│   │   └── lib/         # types.ts, utils.ts (calculation logic)
│   ├── investment-analysis/  # Mutual fund + stock market index analysis
│   │   ├── components/
│   │   ├── hoc/         # with-instruments (loads + currency-converts instruments)
│   │   ├── hooks/       # instruments.ts (data + returns queries)
│   │   ├── lib/         # types.ts, utils.ts, indexes.ts (supported index registry)
│   │   ├── server/      # Server functions (index history, FX rates via Yahoo Finance)
│   │   └── workers/     # Web Workers for heavy computation (returns.worker.ts)
│   └── schedule-fa-a3/  # ITR Schedule FA / A3 generation
│       ├── components/
│       ├── hooks/
│       ├── lib/
│       └── server/      # Server-side functions (stock info, TT buy rate)
├── hooks/               # Shared custom hooks (currency, locale, IP, settings)
├── lib/                 # Shared utilities (utils.ts with cn() helper)
├── routes/              # TanStack Router file-based routes
│   ├── __root.tsx       # Root layout (HTML shell, providers, devtools)
│   ├── index.tsx        # Home page
│   ├── calculators/     # /calculators/* routes
│   ├── investment-analysis/  # /investment-analysis/* routes (price history, CAGR, SIP, SWP)
│   └── itr/             # /itr/* routes (Schedule FA)
├── router.tsx           # Router creation + type registration
├── globals.css          # Tailwind CSS entry point
└── routeTree.gen.ts     # Auto-generated route tree (DO NOT EDIT)
```

## Key Conventions

### Code Style

- **Formatter/Linter**: Biome — uses tabs for indentation, single quotes for JS/JSX/CSS, trailing commas (ES5 style).
- **No Prettier/ESLint** — Biome handles both formatting and linting.
- **Import alias**: `@/*` maps to `./src/*`.

### Architecture Patterns

- **Feature-based organization**: Each feature domain lives under `src/features/<name>/` with its own `components/`, `hooks/`, `lib/`, and optionally `server/` and `workers/` subdirectories.
- **Route ↔ Feature mapping**: Routes in `src/routes/` are thin wrappers that import from `src/features/`.
- **Server functions**: Server-side logic lives in `src/features/*/server/` and runs on Nitro.
- **Web Workers**: CPU-intensive calculations (e.g., returns analysis) are offloaded to Web Workers.
- **Instrument abstraction**: Mutual funds and stock market indexes are both normalised into the `Instrument` type (`id`, `name`, `type`, `currency`, `earliestDate`, `lastDate`, `prices`). Instrument ids are prefixed (`mf:<schemeCode>`, `index:<symbol>`), and the CAGR/SIP/SWP engine, worker, charts, and tables operate purely on `Instrument`.
- **Instrument loading**: `withInstruments` (`hoc/with-instruments.tsx`) reads the repeated `mfSchemeCode` and `indexSymbol` search params, loads both data sets, and converts every price series into the user's settings currency using daily Yahoo Finance FX rates before passing `instruments` to the wrapped component.
- **Supported indexes**: Registered in `lib/indexes.ts` (Indian, US, European, and Japanese benchmarks). Each entry declares its native currency, and the index history server function validates symbols against this registry.
- **Daily series**: `buildDailySeries` forward-fills sparse price/FX data into a continuous daily series; currency conversion also forward-fills the last known FX rate, so a series is only trimmed at the start, before the first available rate (Yahoo FX history starts ~2003).
- **Query persistence**: TanStack Query caches are persisted to `localStorage` with a 24-hour GC time and 1-hour stale time.

### Component Patterns

- **shadcn/ui**: UI primitives are in `src/components/ui/`. These are generated files — modify with care.
- **Shared components**: App-level reusable components (sidebar, breadcrumbs, currency display) are in `src/components/`.
- **Feature components**: Domain-specific components are in `src/features/<name>/components/`.

## Commands

| Command             | Description                        |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Start dev server on port 3000      |
| `npm run build`     | Production build (Vite + Nitro)    |
| `npm run preview`   | Preview production build           |
| `npm run start`     | Start production server            |
| `npm run lint`      | Run Biome linter (`biome check`)   |
| `npm run format`    | Auto-format with Biome             |

## Environment Variables

- `VITE_BASE_URL` — Base URL for the application (defined in `.env`).
- Local overrides go in `.env.local` (git-ignored).

## Important Notes

- **No test suite exists** — there are no tests or test runner configured.
- **`src/routeTree.gen.ts` is auto-generated** by TanStack Router — never edit manually. It is also excluded from Biome linting.
- **Vercel deploys only `main` branch and PRs** — feature/fix/dev branches are ignored per `vercel.json`.
- **`npm run lint` reports a pre-existing formatting error in `vercel.json`** (spaces vs tabs) — scope formatting to source with `npx biome check --write src/` and treat that single error as the baseline.
- **All rights reserved** — this project has no open-source license. Code is public for viewing only.
- **Keep `AGENTS.md` and `README.md` up to date** whenever you add new features, change the tech stack, modify commands, or alter project structure.
- **Use `AGENTS.md` as a memory and decision store** — when you make significant architectural decisions, adopt new conventions, or discover important caveats, record them here so future agents and contributors have the context.
