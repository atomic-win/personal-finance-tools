import _ from 'lodash';
import { DateTime } from 'luxon';
import type {
	ExchangeRate,
	StockData,
	Transaction,
} from '@/features/schedule-fa/lib/types';

export type GroupingOption = 'none' | 'by-stock' | 'by-year';

export type DatedValue = {
	date: string;
	units: number;
	price: number;
	exchangeRate: ExchangeRate;
};

export type RowItem = {
	countryNameAndCode: string;
	nameOfEntity: string;
	addressOfEntity: string;
	zipCode: string;
	natureOfEntity: string;
	dateOfAcquiring: string;
	currency: string;
	initials: DatedValue[];
	peaks: DatedValue[];
	closings: DatedValue[];
	dividends: DatedValue[];
	saleProceeds: DatedValue[];
};

export function calculateRowItems(
	transactions: Transaction[],
	stockData: Map<string, StockData>,
	ratesByCurrency: Map<string, ExchangeRate[]>,
	year: number,
	grouping: GroupingOption
): RowItem[] {
	const calendarYearEnd = `${year}-12-31`;

	const transactionsBySymbol = _.groupBy(
		transactions.filter((tx) => tx.date <= calendarYearEnd),
		'symbol'
	);

	const allRows: RowItem[] = [];
	for (const [symbol, txs] of Object.entries(transactionsBySymbol)) {
		const stock = stockData.get(symbol);
		if (!stock) {
			throw new Error(`Missing stock data for symbol ${symbol}`);
		}

		const rates = ratesByCurrency.get(stock.currency);
		if (!rates) {
			throw new Error(
				`Missing exchange rate data for currency ${stock.currency}`
			);
		}

		const rowsForSymbol = calculateRowItemsForOneSymbol(
			txs,
			stock,
			rates,
			year
		);

		if (rowsForSymbol.length === 0) {
			continue;
		}

		if (grouping === 'by-stock') {
			allRows.push(combineRows(rowsForSymbol));
			continue;
		}

		if (grouping === 'by-year') {
			const rowsGroupedByYear = _.groupBy(rowsForSymbol, (row) =>
				row.dateOfAcquiring.slice(0, 4)
			);

			for (const [_, rows] of Object.entries(rowsGroupedByYear)) {
				allRows.push(combineRows(rows));
			}

			continue;
		}

		allRows.push(...rowsForSymbol);
	}

	return allRows;
}

function calculateRowItemsForOneSymbol(
	transactions: Transaction[],
	stock: StockData,
	rates: ExchangeRate[],
	year: number
): RowItem[] {
	const calendarYearStart = `${year}-01-01`;
	const calendarYearEnd = `${year}-12-31`;

	const dailyPricesInYear = stock.dailyPrices.filter(
		(p) => p.date >= calendarYearStart && p.date <= calendarYearEnd
	);

	const dividendsInYear = stock.dividends.filter(
		(d) => d.date >= calendarYearStart && d.date <= calendarYearEnd
	);

	if (dailyPricesInYear.length === 0) {
		throw new Error(
			`No price data available for ${stock.symbol} in the selected year.`
		);
	}

	// biome-ignore lint/style/noNonNullAssertion: we already check for valid dates above
	const priceAtYearEnd = _.maxBy(dailyPricesInYear, 'date')!;
	const exchangeRateAtYearEnd = findRate(rates, priceAtYearEnd.date);

	const groupedTransactions = _.groupBy(
		transactions,
		(tx) => `${tx.date}|${tx.type}|${tx.price}`
	);

	const sorted = _.sortBy(
		Object.values(groupedTransactions).map((group) => {
			const totalUnits = _.sumBy(group, 'units');
			const representativeTx = group[0];
			return {
				...representativeTx,
				units: totalUnits,
			};
		}),
		['date', 'type'],
		['asc', 'desc']
	);

	const buys = sorted
		.filter((tx) => tx.type === 'Buy')
		.map((tx) => ({ ...tx }));

	const sells = sorted
		.filter((tx) => tx.type === 'Sell')
		.map((tx) => ({ ...tx }));

	if (
		_.reduce(buys, (sum, b) => sum + b.units, 0) <
		_.reduce(sells, (sum, s) => sum + s.units, 0)
	) {
		throw new Error(
			`Total units sold for ${stock.symbol} exceed total units bought.`
		);
	}

	sells.reverse();

	const rows: RowItem[] = [];
	for (const buy of buys) {
		const initials: DatedValue[] = [];
		const peaks: DatedValue[] = [];
		const closings: DatedValue[] = [];
		const dividends: DatedValue[] = [];
		const saleProceeds: DatedValue[] = [];

		while (buy.units > 0) {
			if (sells.length !== 0 && sells[sells.length - 1].units === 0) {
				sells.pop();
				continue;
			}

			const sell =
				sells.length > 0
					? sells[sells.length - 1]
					: {
							id: '',
							symbol: buy.symbol,
							date: `${year + 1}-01-01`,
							type: 'Sell' as const,
							units: buy.units,
							price: 0,
							remarks: '',
						};

			const matchedUnits = Math.min(buy.units, sell.units);

			buy.units -= matchedUnits;
			sell.units -= matchedUnits;

			if (sell.date < calendarYearStart) {
				continue; // This sale doesn't affect Schedule FA for the year
			}

			// biome-ignore lint/style/noNonNullAssertion: we already check for valid dates above
			const peak = _.maxBy(
				[
					...dailyPricesInYear.filter(
						(p) => p.date >= buy.date && p.date < sell.date
					),
					buy.date >= calendarYearStart && buy.date <= calendarYearEnd
						? { date: buy.date, price: buy.price }
						: { date: buy.date, price: 0 },
					sell.date >= calendarYearStart && sell.date <= calendarYearEnd
						? { date: sell.date, price: sell.price }
						: { date: sell.date, price: 0 },
				],
				'price'
			)!;

			initials.push({
				date: buy.date,
				units: matchedUnits,
				price: buy.price,
				exchangeRate: findRate(rates, buy.date),
			});

			peaks.push({
				date: peak.date,
				units: matchedUnits,
				price: peak.price,
				exchangeRate: findRate(rates, peak.date),
			});

			for (const dividend of dividendsInYear) {
				if (dividend.date >= buy.date && dividend.date < sell.date) {
					dividends.push({
						date: dividend.date,
						units: dividend.amount * matchedUnits,
						price: 1,
						exchangeRate: findPreviousMonthEndRate(rates, dividend.date),
					});
				}
			}

			if (sell.date <= calendarYearEnd) {
				saleProceeds.push({
					date: sell.date,
					units: matchedUnits,
					price: sell.price,
					exchangeRate: findRate(rates, sell.date),
				});
			} else {
				closings.push({
					date: priceAtYearEnd.date,
					units: matchedUnits,
					price: priceAtYearEnd.price,
					exchangeRate: exchangeRateAtYearEnd,
				});
			}
		}

		rows.push({
			countryNameAndCode: `${stock.country} — ${stock.countryCode}`,
			nameOfEntity: stock.name,
			addressOfEntity: [stock.address, stock.city, stock.state]
				.filter(Boolean)
				.join(', '),
			zipCode: stock.zip,
			natureOfEntity: 'Equity Shares',
			dateOfAcquiring: buy.date,
			currency: stock.currency,
			initials,
			peaks,
			closings,
			dividends,
			saleProceeds,
		});
	}

	return rows;
}

function combineRows(rows: RowItem[]): RowItem {
	return {
		...rows[0],
		// biome-ignore lint/style/noNonNullAssertion: we already check for valid dates above
		dateOfAcquiring: _.minBy(rows, 'dateOfAcquiring')!.dateOfAcquiring,
		initials: flattenDatedValues(rows.map((r) => r.initials)),
		peaks: flattenDatedValues(rows.map((r) => r.peaks)),
		closings: flattenDatedValues(rows.map((r) => r.closings)),
		dividends: flattenDatedValues(rows.map((r) => r.dividends)),
		saleProceeds: flattenDatedValues(rows.map((r) => r.saleProceeds)),
	};
}

function findRate(rates: ExchangeRate[], date: string): ExchangeRate {
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

	if (!closestBefore && !closestAfter) {
		throw new Error(
			`No exchange rates available to find rate for date ${date}`
		);
	}

	// biome-ignore lint/style/noNonNullAssertion: we already check for valid dates above
	return (closestBefore ?? closestAfter)!;
}

function findPreviousMonthEndRate(
	rates: ExchangeRate[],
	date: string
): ExchangeRate {
	// biome-ignore lint/style/noNonNullAssertion: we already check for valid dates above
	const lastDayOfPrevMonth = DateTime.fromISO(date)
		.startOf('month')
		.minus({ days: 1 })
		.toISODate()!;
	return findRate(rates, lastDayOfPrevMonth);
}

function flattenDatedValues(values: DatedValue[][]): DatedValue[] {
	const all = _.flatMap(values);
	const grouped = _.groupBy(all, (v) => `${v.date}|${v.price}`);
	return Object.values(grouped).map((group) => ({
		date: group[0].date,
		units: _.sumBy(group, 'units'),
		price: group[0].price,
		exchangeRate: group[0].exchangeRate,
	}));
}
