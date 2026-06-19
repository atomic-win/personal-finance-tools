import { DateTime } from 'luxon';
import type {
	ExchangeRate,
	GroupingOption,
	ScheduleFARow,
	StockInfoResponse,
} from './types';

type DailyPrice = { date: string; close: number; high: number };
type Dividend = { date: string; amount: number };
type Lot = {
	symbol: string;
	acquiredOn: string;
	quantity: number;
	purchasePrice: number;
	soldOn: string | null;
	salePrice: number | null;
};

/**
 * Find the exchange rate for a given date.
 * Prefers the closest available date on or before the requested date.
 * Falls back to the closest date after if none exists before.
 */
export function findRate(rates: ExchangeRate[], date: string): number {
	let closestBefore: ExchangeRate | null = null;
	let closestAfter: ExchangeRate | null = null;

	for (const r of rates) {
		if (r.date <= date) {
			if (!closestBefore || r.date > closestBefore.date) {
				closestBefore = r;
			}
		} else {
			if (!closestAfter || r.date < closestAfter.date) {
				closestAfter = r;
			}
		}
	}

	return (closestBefore ?? closestAfter)?.rate ?? 0;
}

/**
 * Get the last day of the previous month for a given date.
 * Used for dividend and sale proceeds exchange rate lookups.
 */
export function getLastDayOfPreviousMonth(dateStr: string): string {
	const dt = DateTime.fromISO(dateStr);
	const lastDay = dt.startOf('month').minus({ days: 1 });
	return lastDay.toISODate() ?? dateStr;
}

/**
 * Find peak price within a date range from daily prices.
 */
export function findPeakPrice(
	dailyPrices: DailyPrice[],
	fromDate: string,
	toDate: string
): { peakPrice: number; peakDate: string } {
	let peakPrice = 0;
	let peakDate = fromDate;

	for (const p of dailyPrices) {
		if (p.date >= fromDate && p.date <= toDate) {
			if (p.close > peakPrice) {
				peakPrice = p.close;
				peakDate = p.date;
			}
		}
	}

	return { peakPrice, peakDate };
}

/**
 * Find closing price on or before a given date.
 */
export function findClosingPrice(
	dailyPrices: DailyPrice[],
	date: string
): { closingPrice: number; closingDate: string } {
	let closest: DailyPrice | null = null;
	for (const p of dailyPrices) {
		if (p.date <= date) {
			if (!closest || p.date > closest.date) {
				closest = p;
			}
		}
	}
	return {
		closingPrice: closest?.close ?? 0,
		closingDate: closest?.date ?? date,
	};
}

/**
 * Compute dividends for a reporting year, with per-dividend INR conversion.
 * Only counts dividends within the lot's held period ∩ calendar year.
 */
function computeDividends(
	dividends: Dividend[],
	quantity: number,
	year: number,
	rates: ExchangeRate[],
	heldFrom: string,
	heldTo: string
): { totalUSD: number; totalINR: number } {
	const yearStart = `${year}-01-01`;
	const yearEnd = `${year}-12-31`;
	const from = heldFrom > yearStart ? heldFrom : yearStart;
	const to = heldTo < yearEnd ? heldTo : yearEnd;

	let totalUSD = 0;
	let totalINR = 0;

	for (const d of dividends) {
		if (d.date >= from && d.date <= to) {
			const divUSD = d.amount * quantity;
			const rateDate = getLastDayOfPreviousMonth(d.date);
			const rate = findRate(rates, rateDate);
			totalUSD += divUSD;
			totalINR += divUSD * rate;
		}
	}

	return { totalUSD, totalINR };
}

/**
 * Compute sale proceeds for a lot sold during the reporting year.
 */
function computeSaleProceeds(
	lot: Lot,
	year: number,
	rates: ExchangeRate[]
): { totalUSD: number; totalINR: number } {
	if (!lot.soldOn || !lot.salePrice) return { totalUSD: 0, totalINR: 0 };

	const yearStart = `${year}-01-01`;
	const yearEnd = `${year}-12-31`;

	if (lot.soldOn < yearStart || lot.soldOn > yearEnd) {
		return { totalUSD: 0, totalINR: 0 };
	}

	const totalUSD = lot.salePrice * lot.quantity;
	const rateDate = getLastDayOfPreviousMonth(lot.soldOn);
	const rate = findRate(rates, rateDate);

	return { totalUSD, totalINR: totalUSD * rate };
}

export type ComputeInput = {
	heldLots: Lot[];
	soldLots: Lot[];
	stockData: Map<string, StockInfoResponse>;
	ratesByCurrency: Map<string, ExchangeRate[]>;
	year: number;
};

/**
 * Compute Schedule FA rows for all lots (held + sold in reporting year).
 */
export function computeScheduleFARows(input: ComputeInput): ScheduleFARow[] {
	const { heldLots, soldLots, stockData, ratesByCurrency, year } = input;
	const yearStart = `${year}-01-01`;
	const yearEnd = `${year}-12-31`;

	const rows: ScheduleFARow[] = [];
	let slNo = 1;

	// Group sold lots by symbol for sale proceeds
	const soldBySymbol = new Map<string, Lot[]>();
	for (const lot of soldLots) {
		const existing = soldBySymbol.get(lot.symbol) ?? [];
		existing.push(lot);
		soldBySymbol.set(lot.symbol, existing);
	}

	for (const lot of heldLots) {
		// Skip lots acquired after the reporting year
		if (lot.acquiredOn > yearEnd) continue;

		const stock = stockData.get(lot.symbol);
		if (!stock) continue;

		const rates = ratesByCurrency.get(stock.currency) ?? [];

		// Peak: within held period ∩ calendar year
		const peakFrom = lot.acquiredOn > yearStart ? lot.acquiredOn : yearStart;
		const peakTo = yearEnd;
		const { peakPrice, peakDate } = findPeakPrice(
			stock.dailyPrices,
			peakFrom,
			peakTo
		);

		// Closing: Dec 31
		const { closingPrice } = findClosingPrice(stock.dailyPrices, yearEnd);

		// Initial value (cost of acquisition)
		const initialValueForeign = lot.purchasePrice * lot.quantity;
		const initialRate = findRate(rates, lot.acquiredOn);

		// Peak value
		const peakValueForeign = peakPrice * lot.quantity;
		const peakRate = findRate(rates, peakDate);

		// Closing balance
		const closingBalanceForeign = closingPrice * lot.quantity;
		const closingRate = findRate(rates, yearEnd);

		// Dividends
		const divs = computeDividends(
			stock.dividends,
			lot.quantity,
			year,
			rates,
			lot.acquiredOn,
			lot.soldOn ?? yearEnd,
		);

		// Sale proceeds from sold lots of same symbol acquired on the same date
		const relatedSoldLots = (soldBySymbol.get(lot.symbol) ?? []).filter(
			(s) => s.acquiredOn === lot.acquiredOn
		);
		let saleProceedsForeign = 0;
		let saleProceedsINR = 0;
		for (const soldLot of relatedSoldLots) {
			const sp = computeSaleProceeds(soldLot, year, rates);
			saleProceedsForeign += sp.totalUSD;
			saleProceedsINR += sp.totalINR;
		}

		rows.push({
			slNo: slNo++,
			countryNameAndCode: `${stock.country} — ${stock.countryCode}`,
			nameOfEntity: stock.name,
			addressOfEntity: [stock.address, stock.city, stock.state]
				.filter(Boolean)
				.join(', '),
			zipCode: stock.zip,
			natureOfEntity: 'Equity Shares',
			dateOfAcquiring: lot.acquiredOn,
			currency: stock.currency,
			initialValueForeign,
			initialValueINR: initialValueForeign * initialRate,
			peakValueForeign,
			peakValueINR: peakValueForeign * peakRate,
			closingBalanceForeign,
			closingBalanceINR: closingBalanceForeign * closingRate,
			totalDividendsForeign: divs.totalUSD,
			totalDividendsINR: divs.totalINR,
			totalSaleProceedsForeign: saleProceedsForeign,
			totalSaleProceedsINR: saleProceedsINR,
		});
	}

	return rows;
}

/**
 * Group Schedule FA rows based on grouping option.
 */
export function groupRows(
	rows: ScheduleFARow[],
	option: GroupingOption
): ScheduleFARow[] {
	if (option === 'none') return rows;

	const groupKey = (row: ScheduleFARow): string => {
		switch (option) {
			case 'by-stock':
				return row.nameOfEntity;
			case 'by-year':
				return row.dateOfAcquiring.substring(0, 4);
		}
	};

	const groups = new Map<string, ScheduleFARow[]>();
	for (const row of rows) {
		const key = groupKey(row);
		const existing = groups.get(key) ?? [];
		existing.push(row);
		groups.set(key, existing);
	}

	const grouped: ScheduleFARow[] = [];
	let slNo = 1;

	for (const [, group] of groups) {
		const first = group[0];
		const earliestDate = group.reduce(
			(min, r) => (r.dateOfAcquiring < min ? r.dateOfAcquiring : min),
			first.dateOfAcquiring
		);

		grouped.push({
			slNo: slNo++,
			countryNameAndCode: first.countryNameAndCode,
			nameOfEntity: first.nameOfEntity,
			addressOfEntity: first.addressOfEntity,
			zipCode: first.zipCode,
			natureOfEntity: first.natureOfEntity,
			dateOfAcquiring: earliestDate,
			currency: first.currency,
			initialValueForeign: sum(group, 'initialValueForeign'),
			initialValueINR: sum(group, 'initialValueINR'),
			peakValueForeign: sum(group, 'peakValueForeign'),
			peakValueINR: sum(group, 'peakValueINR'),
			closingBalanceForeign: sum(group, 'closingBalanceForeign'),
			closingBalanceINR: sum(group, 'closingBalanceINR'),
			totalDividendsForeign: sum(group, 'totalDividendsForeign'),
			totalDividendsINR: sum(group, 'totalDividendsINR'),
			totalSaleProceedsForeign: sum(group, 'totalSaleProceedsForeign'),
			totalSaleProceedsINR: sum(group, 'totalSaleProceedsINR'),
		});
	}

	return grouped;
}

function sum(rows: ScheduleFARow[], key: keyof ScheduleFARow): number {
	return rows.reduce((acc, r) => acc + (r[key] as number), 0);
}
