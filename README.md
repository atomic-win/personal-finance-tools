# Personal Finance Tools

A web application providing calculators and analysis tools for personal finance — investment return calculators, mutual fund and stock market index analysis, and ITR schedule generation.

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (Vite + Nitro)
- **UI**: React 19, Tailwind CSS v4, [shadcn/ui](https://ui.shadcn.com/)
- **Routing**: [TanStack Router](https://tanstack.com/router) (file-based)
- **Data**: [TanStack Query](https://tanstack.com/query) (persisted to localStorage)
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Analytics**: Google Analytics 4 via the Google tag (optional)
- **Linting/Formatting**: [Biome](https://biomejs.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

## Features

- **Calculators** — Fixed Deposit, Recurring Deposit, SIP, and SWP return calculators.
- **Investment Analysis** — Price history, CAGR, SIP, and SWP analysis for Indian mutual funds and global stock market indexes (Nifty 50, Sensex, S&P 500, NASDAQ 100 and more), compared in the currency of your choice (uses Web Workers for heavy computation).
- **ITR Schedule FA / A3** — Generate Schedule FA (Foreign Assets) and Schedule A3 for Indian income tax returns.

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Google Analytics

Google Analytics 4 is optional and only loads in production builds when
`VITE_GA_MEASUREMENT_ID` is set. Development (`npm run dev`) does not send analytics.
The tracked `.env` leaves this setting blank so analytics is disabled by default.
The Google tag loads through `gtm.js`; settings and destinations are managed in
Google's tag UI rather than a deprecated in-page `gtag('config')` call.
It is included once in the shared root document's `<head>`, before `HeadContent`,
so all routes are covered without adding tags to individual pages.

1. Create a GA4 property and a Web data stream for your site's URL. Copy the
   measurement ID (`G-...`).
2. In Vercel's project environment variables, set `VITE_GA_MEASUREMENT_ID` to that
   ID for **Production**, then redeploy. Leave it unset for Preview to avoid
   counting PR traffic. The ID is public and is embedded at build time.
3. In the stream's **Enhanced measurement > Page views > Show advanced settings**,
   enable **Page loads** and **Page changes based on browser history events**.
   The Google tag handles initial page views and client-side navigation; do not
   add another manual page-view listener or a second tag for the same stream.
4. Visit the deployed site and navigate between tools. Confirm events in GA4's
   Realtime report, or use DebugView with debug mode enabled.

For a local production preview, set `VITE_GA_MEASUREMENT_ID=G-...` in `.env.local`,
then run `npm run build` and `npm run preview`. Use a separate test stream if you
do not want local visits in production reports. To disable analytics, remove the
variable and rebuild/redeploy.

Page-view events include page URLs; this integration does not add custom events
for calculator inputs or uploaded tax data.

## Available Scripts

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start dev server on port 3000    |
| `npm run build`   | Production build (Vite + Nitro)  |
| `npm run preview` | Preview production build         |
| `npm run start`   | Start production server          |
| `npm run lint`    | Run Biome linter                 |
| `npm run format`  | Auto-format with Biome           |

## Project Structure

```
src/
├── components/       # Shared UI components (shadcn/ui primitives in ui/)
├── features/         # Feature modules with components, hooks, lib, server, workers
│   ├── calculators/
│   ├── investment-analysis/
│   └── schedule-fa-a3/
├── hooks/            # Shared custom hooks
├── lib/              # Shared utilities
└── routes/           # TanStack Router file-based routes
```

For detailed architecture and conventions, see [AGENTS.md](./AGENTS.md).

## License & Usage Notice

This repository is made public **for viewing purposes only**.  
At this time, the code is **not licensed for copying, modification, or redistribution**.  

You may **browse and read** the source code, but you **do not have permission** to:  
- Copy or reuse the code in your own projects  
- Fork or redistribute the repository  
- Modify and share derivative works  

A license may be added in the future, but until then, **all rights are reserved**.
