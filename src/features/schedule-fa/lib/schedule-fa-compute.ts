import { DateTime } from 'luxon';
import type {
	DailyPrice,
	Dividend,
	ExchangeRate,
	GroupingOption,
	Lot,
	ScheduleFARow,
	StockInfoResponse,
} from './types';

/**
 * Find the exchange rate for a given date.
 * Uses the closest available date on or before the requested date.
 */
export function findRate(rates: ExchangeRate[], date: string): number {
	let closest: ExchangeRate | null = null;
	for (const r of rates) {
		if (r.date <= date) {
			if (!closest || r.date > closest.date) {
				closest = r;
			}
		}
	}
	return closest?.rate ?? 0;
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
			if (p.high > peakPrice) {
				peakPrice = p.high;
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
 */
function computeDividends(
	dividends: Dividend[],
	quantity: number,
	year: number,
	rates: ExchangeRate[]
): { totalUSD: number; totalINR: number } {
	const yearStart = `${year}-01-01`;
	const yearEnd = `${year}-12-31`;

	let totalUSD = 0;
	let totalINR = 0;

	for (const d of dividends) {
		if (d.date >= yearStart && d.date <= yearEnd) {
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
		const initialValueUSD = lot.purchasePrice * lot.quantity;
		const initialRate = findRate(rates, lot.acquiredOn);

		// Peak value
		const peakValueUSD = peakPrice * lot.quantity;
		const peakRate = findRate(rates, peakDate);

		// Closing balance
		const closingBalanceUSD = closingPrice * lot.quantity;
		const closingRate = findRate(rates, yearEnd);

		// Dividends
		const divs = computeDividends(stock.dividends, lot.quantity, year, rates);

		// Sale proceeds from sold lots of same symbol acquired on the same date
		const relatedSoldLots = (soldBySymbol.get(lot.symbol) ?? []).filter(
			(s) => s.acquiredOn === lot.acquiredOn
		);
		let saleProceedsUSD = 0;
		let saleProceedsINR = 0;
		for (const soldLot of relatedSoldLots) {
			const sp = computeSaleProceeds(soldLot, year, rates);
			saleProceedsUSD += sp.totalUSD;
			saleProceedsINR += sp.totalINR;
		}

		rows.push({
			slNo: slNo++,
			countryNameAndCode: `${stock.country} — ${stock.countryCode}`,
			nameOfEntity: stock.name,
			addressOfEntity: stock.exchange,
			zipCode: '',
			natureOfEntity: 'Equity Shares',
			dateOfAcquiring: lot.acquiredOn,
			initialValueUSD,
			initialValueINR: initialValueUSD * initialRate,
			peakValueUSD,
			peakValueINR: peakValueUSD * peakRate,
			closingBalanceUSD,
			closingBalanceINR: closingBalanceUSD * closingRate,
			totalDividendsUSD: divs.totalUSD,
			totalDividendsINR: divs.totalINR,
			totalSaleProceedsUSD: saleProceedsUSD,
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
			case 'by-stock-and-year':
				return `${row.nameOfEntity}|${row.dateOfAcquiring.substring(0, 4)}`;
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
			initialValueUSD: sum(group, 'initialValueUSD'),
			initialValueINR: sum(group, 'initialValueINR'),
			peakValueUSD: sum(group, 'peakValueUSD'),
			peakValueINR: sum(group, 'peakValueINR'),
			closingBalanceUSD: sum(group, 'closingBalanceUSD'),
			closingBalanceINR: sum(group, 'closingBalanceINR'),
			totalDividendsUSD: sum(group, 'totalDividendsUSD'),
			totalDividendsINR: sum(group, 'totalDividendsINR'),
			totalSaleProceedsUSD: sum(group, 'totalSaleProceedsUSD'),
			totalSaleProceedsINR: sum(group, 'totalSaleProceedsINR'),
		});
	}

	return grouped;
}

function sum(rows: ScheduleFARow[], key: keyof ScheduleFARow): number {
	return rows.reduce((acc, r) => acc + (r[key] as number), 0);
}
