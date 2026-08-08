# Personal Finance Tools

A web application providing calculators and analysis tools for personal finance — investment return calculators, mutual fund and stock market index analysis, and ITR schedule generation.

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (Vite + Nitro)
- **UI**: React 19, Tailwind CSS v4, [shadcn/ui](https://ui.shadcn.com/)
- **Routing**: [TanStack Router](https://tanstack.com/router) (file-based)
- **Data**: [TanStack Query](https://tanstack.com/query) (persisted to localStorage)
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
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
