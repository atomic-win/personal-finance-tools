# Schedule FA — Table A3: Foreign Equity & Debt Interest (Direct Holdings)

## Overview
A tool at route `/itr/schedule-fa/a3` that generates the **Schedule FA — Table A3** (Foreign Equity and Debt Interest held directly outside India) output for Indian ITR filing. The user provides foreign stock holdings (symbol, quantity, purchase date) and the tool auto-fetches prices, dividends, exchange/country info, and USD→INR conversion (SBI TT Buying Rate) to produce a ready-to-use output table.

> **Why Table A3?** A3 is for stocks held **directly** (e.g., via Vested, INDmoney, Schwab). Table A4 is for **indirect** holdings via entities/trusts/funds.

---

## Input

Two input modes:
1. **CSV Upload** — fixed format (see below); tool computes net holdings from buy/sell transactions
2. **Manual Form Entry** — add/edit holdings row by row in an editable table

### CSV Format

| Column | Description | Example |
|--------|-------------|---------|
| Date | Transaction date | `2025-03-15` |
| Remarks | Free text (ignored by tool) | `Bought on dip` |
| Symbol | Stock ticker | `AAPL` |
| Type | `Buy` or `Sell` | `Buy` |
| Units | Number of shares | `10` |
| Price | Price per share (USD) | `172.50` |

Example CSV:
```csv
Date,Remarks,Symbol,Type,Units,Price
2023-05-15,Initial purchase,AAPL,Buy,10,172.50
2024-08-20,Added more,AAPL,Buy,5,225.00
2025-02-10,Partial exit,AAPL,Sell,3,230.00
2024-01-20,First buy,MSFT,Buy,8,380.00
```

**Processing logic:**
- Group transactions by symbol
- Net holdings = sum of Buy units − sum of Sell units (must be ≥ 0)
- For cost basis (initial value), use **FIFO** — first-in, first-out to match sells against earliest buys
- Remaining lots after sells become the holdings with their original purchase dates and prices

### Manual Entry Fields
- **Stock Symbol** (e.g., `AAPL`)
- **Quantity** held
- **Purchase Date**
- **Purchase Price (per share, USD)**

All inputs are editable in the holdings table before generating output.

### Reporting Year (Calendar Year)
- Schedule FA follows the **calendar year** (Jan 1 – Dec 31), not the Indian financial year
- Defaults to **previous calendar year** (e.g., if today is June 2026 → 2025)
- User can change via a dropdown

---

## Auto-fetched Data (Yahoo Finance API)
For each stock symbol + reporting year:
- **Closing price on Jan 1** (or first trading day) → not needed; initial value = acquisition cost
- **Peak (highest) price** at any point during Jan 1 – Dec 31 → peak value
- **Closing price on Dec 31** (or last trading day) → closing value
- **Dividend history** for Jan 1 – Dec 31 → income derived
- **Exchange / country** (e.g., NASDAQ → United States)
- **USD→INR exchange rate** — ideally SBI TT Buying Rate; fallback to Yahoo `USDINR=X` closing on Dec 31

### Server-side Proxies (Vercel Serverless Functions)

Two GET APIs — one per symbol/currency pair — returning **entire history**. Cacheable at the Vercel Edge.

---

#### API 1: `/api/stock-info` — Stock Details (per symbol)

Returns company info, **full** daily price history, and **full** dividend history for a single symbol.

**Request:**

```
GET /api/stock-info?symbol=AAPL
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `symbol` | `string` | Yes | Stock ticker symbol |

**Response:**

```json
{
  "symbol": "AAPL",
  "name": "Apple Inc.",
  "exchange": "NASDAQ",
  "country": "United States",
  "countryCode": "US",
  "dailyPrices": [
    { "date": "2020-01-02", "close": 75.09, "high": 75.15 },
    { "date": "2020-01-03", "close": 74.36, "high": 75.14 },
    "...",
    { "date": "2025-12-31", "close": 235.20, "high": 236.00 }
  ],
  "dividends": [
    { "date": "2020-02-07", "amount": 0.19 },
    "...",
    { "date": "2025-11-14", "amount": 0.25 }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `symbol` | `string` | Stock ticker symbol |
| `name` | `string` | Company full name |
| `exchange` | `string` | Exchange name (e.g., "NASDAQ", "NYSE") |
| `country` | `string` | Country of exchange |
| `countryCode` | `string` | ISO country code (e.g., "US") |
| `dailyPrices[]` | `Array<{ date, close, high }>` | Full daily price history |
| `dividends[]` | `Array<{ date, amount }>` | Full dividend history (per share) |

**Caching:** `Cache-Control: s-maxage=86400, stale-while-revalidate=3600` — cached at Vercel Edge for 24h. Historical data rarely changes; SWR keeps it fresh.

**Yahoo Finance calls (internal):**
1. `yahooFinance.quoteSummary(symbol, { modules: ['price', 'quoteType'] })` → name, exchange, country
2. `yahooFinance.historical(symbol, { period1: earliest })` → full daily prices
3. `yahooFinance.historical(symbol, { period1: earliest, events: 'div' })` → full dividends

---

#### API 2: `/api/tt-buy-rate` — USD→INR Rates (full history)

Returns **full** USD→INR daily exchange rate history. Reusable across ITR tools.

**Request:**

```
GET /api/tt-buy-rate?from=USD
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `from` | `string` | Yes | Source currency (e.g., `USD`). Target is always INR. |

**Response:**

```json
[
  { "date": "2003-12-01", "rate": 45.58 },
  "...",
  { "date": "2025-12-31", "rate": 83.45 }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `[].date` | `string` | Date (YYYY-MM-DD) |
| `[].rate` | `number` | SBI TT Buying Rate (fallback: Yahoo `USDINR=X`) |

**Caching:** `Cache-Control: s-maxage=86400, stale-while-revalidate=3600` — cached at Vercel Edge for 24h.

**Yahoo Finance call (internal):**
- `yahooFinance.historical('USDINR=X', { period1: earliest })` → full history

---

#### Client-side Computation

The client (browser) handles all logic using the full history data:
1. **FIFO lot matching** — from CSV buy/sell transactions
2. **Filter prices to reporting year** — from `dailyPrices[]`
3. **Peak price per lot** — filter to `max(acquiredOn, Jan 1)` to `min(soldOn, Dec 31)`, find max
4. **Closing price** — last price on or before Dec 31
5. **Look up exchange rates** — find rate for each needed date from the full rates array (nearest available date if exact match missing)
6. **Apply exchange rate rules** — acquisition date rate, peak date rate, Dec 31 rate, last day of prev month for dividends & sales
7. **Compute INR values** — multiply USD amounts by the corresponding rate

> Client calls `/api/stock-info?symbol=X` once per symbol (parallelized) and `/api/tt-buy-rate?from=USD` once. All subsequent filtering, peak computation, and INR conversion happens locally.

### Client-side Caching (TanStack Query)

Both API responses are cached via TanStack Query (already in the project with localStorage persistence):

| Hook | Query Key | `staleTime` | Rationale |
|------|-----------|-------------|-----------|
| `useStockInfo(symbol)` | `['stock-info', symbol]` | `Infinity` | Full history; append-only data. Refetch on window focus covers new days. |
| `useTTBuyRate(from)` | `['tt-buy-rate', from]` | `Infinity` | Same as above. |

Since TanStack Query is already configured with `localStorage` persistence (`@tanstack/query-async-storage-persister`), cached responses survive page reloads — no redundant API calls.

---

## Output — Schedule FA Table A3
Read-only table matching ITR-2 Table A3 columns:

| Col | ITR Column Name | Source |
|-----|----------------|--------|
| 1 | Sl. No | Auto-incremented |
| 2 | Country Name and Code | Auto-fetched (e.g., "United States — US") |
| 3 | Name of entity | Company name (e.g., "Apple Inc.") |
| 4 | Address of entity | Exchange address (e.g., "NASDAQ, New York") |
| 5 | Zip code | Exchange zip code |
| 6 | Nature of entity | "Equity Shares" |
| 7 | Date of acquiring the interest | Purchase date (earliest if clubbed) |
| 8 | Initial value of the investment | Cost of acquisition (purchase price × qty) in INR |
| 9 | Peak value of investment during the period | Highest price within (held period ∩ calendar year) × qty in INR |
| 10 | Closing balance | Dec 31 price × qty in INR |
| 11 | Total gross amount paid/credited with respect to the holding during the period | Total dividends in INR (exchange rate = last day of previous month) |
| 12 | Total gross proceeds from sale or redemption of investment during the period | Sale price × sold qty in INR (exchange rate = last day of previous month) |

> **Note:** "Initial Value" = cost of acquisition (original purchase price), not Jan 1 market price.

### Exchange Rate Rules
| Value | Exchange Rate Date |
|-------|-------------------|
| Initial value (col 8) | Acquisition date |
| Peak value (col 9) | Peak price date |
| Closing balance (col 10) | Dec 31 |
| Dividends (col 11) | **Last day of month before** dividend date |
| Sale proceeds (col 12) | **Last day of month before** sale date |

All rates use **SBI TT Buying Rate** (Yahoo `USDINR=X` as fallback).

---

## Worked Example — Complicated Case

### Input (CSV transactions)

```csv
Date,Remarks,Symbol,Type,Units,Price
2023-05-15,Initial buy,AAPL,Buy,10,172.50
2024-08-20,Added more,AAPL,Buy,5,225.00
2025-02-10,Partial exit,AAPL,Sell,3,230.00
2025-06-05,More sell,AAPL,Sell,2,240.00
2024-01-20,First buy,MSFT,Buy,8,380.00
```

**Reporting year: 2025**

---

### Step 1 — FIFO Lot Matching for AAPL

Sells consume earliest lots first:

| Sell | Date | Units | Consumed From |
|------|------|-------|---------------|
| Sell 1 | 2025-02-10 | 3 | Lot 1 (10 → 7) |
| Sell 2 | 2025-06-05 | 2 | Lot 1 (7 → 5) |

**Resulting lots sent to API:**

| Lot | acquiredOn | soldOn | Remaining Qty | Held Period in 2025 |
|-----|-----------|--------|---------------|---------------------|
| Lot 1 (remaining) | 2023-05-15 | `null` (still held) | **5** | Jan 1 – Dec 31 |
| Lot 2 | 2024-08-20 | `null` (still held) | **5** | Jan 1 – Dec 31 |

**Sold lots (for col 12):**

| Sold From | acquiredOn | soldOn | Qty Sold | Sale Price |
|-----------|-----------|--------|----------|------------|
| Lot 1 partial | 2023-05-15 | 2025-02-10 | 3 | $230.00 |
| Lot 1 partial | 2023-05-15 | 2025-06-05 | 2 | $240.00 |

---

### Step 2 — Auto-fetched Data (2025)

**AAPL:**
- Lot 1 (held Jan 1 – Dec 31): Peak = **$248.50** on 2025-08-15
- Lot 2 (held Jan 1 – Dec 31): Peak = **$248.50** on 2025-08-15
- Dec 31 closing: **$235.20**
- Dividends: $0.25 (Feb 14), $0.26 (May 16), $0.26 (Aug 15), $0.25 (Nov 14)

**MSFT:**
- Lot 1 (held Jan 1 – Dec 31): Peak = **$450.75** on 2025-04-20
- Dec 31 closing: **$430.00**
- Dividends: $0.75 (Mar 10), $0.75 (Jun 9), $0.75 (Sep 8), $0.75 (Dec 8)

**USD→INR exchange rates (Yahoo `USDINR=X`):**

| Date | Rate | Used for |
|------|------|----------|
| 2023-05-15 | ₹82.10 | AAPL Lot 1 initial value |
| 2024-08-20 | ₹83.75 | AAPL Lot 2 initial value |
| 2024-01-20 | ₹83.00 | MSFT initial value |
| 2025-01-31 | ₹82.95 | AAPL sell (Feb 10) exchange rate; AAPL dividend (Feb 14) |
| 2025-04-30 | ₹83.30 | AAPL dividend (May 16) |
| 2025-05-31 | ₹83.50 | AAPL sell (Jun 5) exchange rate |
| 2025-07-31 | ₹84.20 | AAPL dividend (Aug 15) |
| 2025-08-15 | ₹84.20 | AAPL peak price date |
| 2025-10-31 | ₹83.80 | AAPL dividend (Nov 14) |
| 2025-04-20 | ₹83.25 | MSFT peak price date |
| 2025-02-28 | ₹83.10 | MSFT dividend (Mar 10) |
| 2025-05-31 | ₹83.50 | MSFT dividend (Jun 9) |
| 2025-08-31 | ₹84.00 | MSFT dividend (Sep 8) |
| 2025-11-30 | ₹83.90 | MSFT dividend (Dec 8) |
| 2025-12-31 | ₹83.45 | Closing balance date |

---

### Step 3 — Output Table (ungrouped, one row per lot)

**AAPL Lot 1** (5 remaining shares @ $172.50, acquired 2023-05-15, held Jan 1 – Dec 31):

| Col | Field | USD | Rate | INR |
|-----|-------|-----|------|-----|
| 8 | Initial value | 5 × $172.50 = **$862.50** | ₹82.10 (2023-05-15) | **₹70,813** |
| 9 | Peak value | 5 × $248.50 = **$1,242.50** | ₹84.20 (2025-08-15) | **₹1,04,619** |
| 10 | Closing balance | 5 × $235.20 = **$1,176.00** | ₹83.45 (2025-12-31) | **₹98,137** |
| 11 | Dividends | 5 × ($0.25+$0.26+$0.26+$0.25) = **$5.10** | per-dividend rates | **₹426** * |
| 12 | Sale proceeds | 3@$230 (Feb) + 2@$240 (Jun) = **$1,170.00** | prev-month rates | **₹97,316** ** |

\* Dividend INR breakdown:
- Feb 14: 5 × $0.25 × ₹82.95 (Jan 31) = ₹103.69
- May 16: 5 × $0.26 × ₹83.30 (Apr 30) = ₹108.29
- Aug 15: 5 × $0.26 × ₹84.20 (Jul 31) = ₹109.46
- Nov 14: 5 × $0.25 × ₹83.80 (Oct 31) = ₹104.75
- **Total = ₹426** (rounded)

\** Sale proceeds INR breakdown (exchange rate = last day of previous month):
- Feb 10: 3 × $230.00 × ₹82.95 (Jan 31) = ₹57,236
- Jun 5: 2 × $240.00 × ₹83.50 (May 31) = ₹40,080
- **Total = ₹97,316**

**AAPL Lot 2** (5 shares @ $225.00, acquired 2024-08-20, held Jan 1 – Dec 31):

| Col | Field | USD | Rate | INR |
|-----|-------|-----|------|-----|
| 8 | Initial value | 5 × $225.00 = **$1,125.00** | ₹83.75 (2024-08-20) | **₹94,219** |
| 9 | Peak value | 5 × $248.50 = **$1,242.50** | ₹84.20 (2025-08-15) | **₹1,04,619** |
| 10 | Closing balance | 5 × $235.20 = **$1,176.00** | ₹83.45 (2025-12-31) | **₹98,137** |
| 11 | Dividends | 5 × $1.02 = **$5.10** | per-dividend rates | **₹426** |
| 12 | Sale proceeds | No sales from this lot | — | **₹0** |

---

### Step 4 — Output Table (clubbed by stock)

When **grouped by stock**, AAPL Lot 1 + Lot 2 merge:

| Col | Field | Value |
|-----|-------|-------|
| 7 | Date of acquiring | **2023-05-15** (earliest) |
| 8 | Initial value (INR) | ₹70,813 + ₹94,219 = **₹1,65,032** |
| 9 | Peak value (INR) | 10 × $248.50 × ₹84.20 = **₹2,09,237** |
| 10 | Closing balance (INR) | 10 × $235.20 × ₹83.45 = **₹1,96,274** |
| 11 | Dividends (INR) | ₹426 + ₹426 = **₹852** (or recomputed with 10 shares) |
| 12 | Sale proceeds (INR) | **₹97,316** (all sales were from Lot 1 via FIFO) |

### Output Grouping Options

The UI provides a toggle to **club (group) rows** in the output table. Options can be combined:

| Option | Behavior |
|--------|----------|
| **By Stock** | All lots of the same symbol merge into one row |
| **By Calendar Year** | All acquisitions in the same calendar year merge into one row |
| **Combined (Stock + Year)** | All lots of the same symbol acquired in the same calendar year merge into one row |

**When rows are clubbed, aggregation rules:**

| Column | Aggregation |
|--------|-------------|
| Date of Acquisition | **Earliest** (minimum) `initialDate` among grouped lots |
| Initial Value (cost) | **Sum** of (purchase price × qty) across grouped lots |
| Initial Value INR | **Sum** of per-lot (purchase price × qty × that lot's exchange rate) |
| Peak Value | **Max** peak price × **total** qty (same peak price for same stock) |
| Closing Value | Dec 31 price × **total** qty |
| Income Derived | Sum of dividends × **total** qty |
| Quantity | **Sum** of quantities across grouped lots |

---

## File Structure

```
api/
├── stock-info.ts                         # Vercel serverless — stock prices & dividends
└── tt-buy-rate.ts                      # Vercel serverless — USD→INR rates (reusable)

src/
├── routes/
│   └── itr/
│       └── schedule-fa/
│           └── a3.tsx                    # Route file (thin wrapper)
├── features/
│   └── schedule-fa/
│       ├── components/
│       │   ├── ScheduleFAPage.tsx        # Main page: year selector, input table, output table
│       │   ├── HoldingsInputTable.tsx    # Editable holdings table + add row
│       │   ├── CSVUploadDialog.tsx       # CSV file upload + validation
│       │   └── ScheduleFAOutput.tsx      # Read-only output table
│       ├── hooks/
│       │   ├── useStockInfo.ts           # React Query hook → /api/stock-info
│       │   └── useTTBuyRate.ts        # React Query hook → /api/tt-buy-rate
│       └── lib/
│           ├── types.ts                  # Zod schemas & TS types
│           ├── csv-parser.ts             # CSV parsing, validation & FIFO lot matching
│           └── schedule-fa-compute.ts    # Client-side computation (peak, closing, INR values)
```

---

## Sidebar Navigation
New **"ITR Tools"** group in `src/components/app-sidebar.tsx`:
```
ITR Tools
  └── Schedule FA — A3
```

---

## Tech Stack (all existing unless noted)
| Concern | Library |
|---------|---------|
| Forms / Validation | `react-hook-form` + `zod` |
| API calls | `axios` + `@tanstack/react-query` |
| UI | shadcn — `Table`, `Button`, `Input`, `Card`, `Dialog`, `Select` |
| Dates | `luxon` |
| Yahoo Finance proxy | **`yahoo-finance2`** (new — server-side only) |

---

## Implementation Phases

### Phase 1 — Foundation
1. Install `yahoo-finance2` (dependency for serverless fns)
2. Create `api/stock-info.ts` — stock prices & dividends proxy
3. Create `api/tt-buy-rate.ts` — USD→INR rates proxy (reusable)
4. Create `src/features/schedule-fa/lib/types.ts` — schemas & types

### Phase 2 — Feature Logic
5. Create `src/features/schedule-fa/lib/csv-parser.ts` — CSV parsing & FIFO
6. Create `src/features/schedule-fa/lib/schedule-fa-compute.ts` — client-side computation
7. Create `src/features/schedule-fa/hooks/useStockInfo.ts`
8. Create `src/features/schedule-fa/hooks/useTTBuyRate.ts`

### Phase 3 — UI Components
9. Create `src/features/schedule-fa/components/HoldingsInputTable.tsx`
10. Create `src/features/schedule-fa/components/CSVUploadDialog.tsx`
11. Create `src/features/schedule-fa/components/ScheduleFAOutput.tsx`
12. Create `src/features/schedule-fa/components/ScheduleFAPage.tsx`

### Phase 4 — Wiring
13. Create `src/routes/itr/schedule-fa/a3.tsx`
14. Update `src/components/app-sidebar.tsx` — add ITR Tools section

### Phase 5 — Verify
15. `npm run build` — no errors
16. `npm run lint` — clean
