import _ from 'lodash';
import { DateTime } from 'luxon';
import { useState } from 'react';
import ErrorComponent from '@/components/error-component';
import LoadingComponent from '@/components/loading-component';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useTransactionsQuery } from '@/features/schedule-fa/hooks/transactions';
import { useStockInfoQueries } from '@/features/schedule-fa/hooks/useStockInfo';
import { useTTBuyRateQueries } from '@/features/schedule-fa/hooks/useTTBuyRate';
import type {
	ExchangeRate,
	StockData,
	Transaction,
} from '@/features/schedule-fa/lib/types';

type GroupingOption = 'none' | 'by-stock' | 'by-year';

export default function ScheduleFAOutput() {
	const [year, setYear] = useState(getDefaultYear());
	const [grouping, setGrouping] = useState<GroupingOption>('none');

	const { isLoading: isLoadingTransactions, data: transactions = [] } =
		useTransactionsQuery();

	const validTransactions = transactions.filter(
		(h) => h.symbol && h.units > 0 && h.date
	);
	const uniqueSymbols = [...new Set(validTransactions.map((h) => h.symbol))];

	const stockQueries = useStockInfoQueries(uniqueSymbols);

	const uniqueCurrencies = [
		...new Set(
			stockQueries.map((q) => q.data?.currency).filter(Boolean) as string[]
		),
	];

	const rateQueries = useTTBuyRateQueries(uniqueCurrencies);

	if (isLoadingTransactions) {
		return null; // Don't show loading state for transactions, as the input table already has one
	}

	if (stockQueries.some((q) => q.isLoading)) {
		return <LoadingComponent loadingMessage='Loading stock information...' />;
	}

	if (stockQueries.some((q) => q.isError)) {
		return (
			<>
				<ErrorComponent errorMessage='Failed to load stock information. Please check the stock symbols and try again.' />
				<div className='p-4'>
					{stockQueries
						.filter((q) => q.isError)
						.map((q, i) => (
							<p key={uniqueSymbols[i]} className='text-sm text-destructive'>
								{uniqueSymbols[i]}:{' '}
								{(q.error as Error)?.message ?? 'Unknown error'}
							</p>
						))}
				</div>
			</>
		);
	}

	if (rateQueries.some((q) => q.isLoading)) {
		return <LoadingComponent loadingMessage='Loading exchange rates...' />;
	}

	if (rateQueries.some((q) => q.isError)) {
		return (
			<>
				<ErrorComponent errorMessage='Failed to load exchange rates. Please try again later.' />
				<div className='p-4'>
					{rateQueries
						.filter((q) => q.isError)
						.map((q, i) => (
							<p key={uniqueCurrencies[i]} className='text-sm text-destructive'>
								{uniqueCurrencies[i]}:{' '}
								{(q.error as Error)?.message ?? 'Unknown error'}
							</p>
						))}
				</div>
			</>
		);
	}

	const stockData = new Map<string, StockData>();
	for (const q of stockQueries.filter((q) => !!q.data)) {
		stockData.set(q.data.symbol, q.data);
	}

	const ratesByCurrency = new Map<string, ExchangeRate[]>();
	for (const q of rateQueries.filter((q) => !!q.data)) {
		ratesByCurrency.set(q.data.currency, q.data.rates);
	}

	if (stockData.size === 0 || ratesByCurrency.size === 0) {
		return (
			<div className='p-4'>
				<p className='text-muted-foreground'>
					No valid stock or exchange rate data available to compute Schedule FA.
				</p>
			</div>
		);
	}

	const rowItems = calculateRowItems(
		validTransactions,
		stockData,
		ratesByCurrency,
		year,
		grouping
	);

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				<h2 className='text-lg font-semibold'>Schedule FA — Table A3 Output</h2>
				<div className='flex items-center gap-4'>
					<div className='flex items-center gap-2'>
						<span className='text-sm text-muted-foreground'>
							Reporting Year:
						</span>
						<Select
							value={String(year)}
							onValueChange={(v) => setYear(Number(v))}
						>
							<SelectTrigger className='w-24'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{getYearOptions().map((y) => (
									<SelectItem key={y} value={String(y)}>
										{y}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className='flex items-center gap-2'>
						<span className='text-sm text-muted-foreground'>Group by:</span>
						<Select
							value={grouping}
							onValueChange={(v) => setGrouping(v as GroupingOption)}
						>
							<SelectTrigger className='w-48'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='none'>No Grouping</SelectItem>
								<SelectItem value='by-stock'>By Stock</SelectItem>
								<SelectItem value='by-year'>By Acquisition Year</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			<ScrollArea className='border rounded-lg'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='text-center'>Sl. No</TableHead>
							<TableHead>Country Name & Code</TableHead>
							<TableHead>Name of Entity</TableHead>
							<TableHead>Address of Entity</TableHead>
							<TableHead>Zip Code</TableHead>
							<TableHead>Nature of Entity</TableHead>
							<TableHead>Date of Acquiring</TableHead>
							<TableHead className='text-right'>Initial Value</TableHead>
							<TableHead className='text-right'>Peak Value</TableHead>
							<TableHead className='text-right'>Closing Balance</TableHead>
							<TableHead className='text-right'>Dividends</TableHead>
							<TableHead className='text-right'>Sale Proceeds</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{rowItems.map((rowItem, index) => (
							<TableRow key={index.toString()}>
								<TableCell className='text-center'>{index + 1}</TableCell>
								<TableCell>{rowItem.countryNameAndCode}</TableCell>
								<TableCell>{rowItem.nameOfEntity}</TableCell>
								<TableCell>{rowItem.addressOfEntity}</TableCell>
								<TableCell>{rowItem.zipCode || '—'}</TableCell>
								<TableCell>{rowItem.natureOfEntity}</TableCell>
								<TableCell>{rowItem.dateOfAcquiring}</TableCell>
								<TableCell className='text-right'>
									{formatAmount(rowItem.initials)}
								</TableCell>
								<TableCell className='text-right'>
									{formatAmount(rowItem.peaks)}
								</TableCell>
								<TableCell className='text-right'>
									{formatAmount(rowItem.closings)}
								</TableCell>
								<TableCell className='text-right'>
									{formatAmount(rowItem.dividends)}
								</TableCell>
								<TableCell className='text-right'>
									{formatAmount(rowItem.saleProceeds)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</ScrollArea>
		</div>
	);
}

type DatedValue = {
	date: string;
	units: number;
	price: number;
	exchangeRate: ExchangeRate;
};

type RowItem = {
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

function calculateRowItems(
	transactions: Transaction[],
	stockData: Map<string, StockData>,
	ratesByCurrency: Map<string, ExchangeRate[]>,
	year: number,
	grouping: GroupingOption
): RowItem[] {
	const transactionsBySymbol = _.groupBy(transactions, 'symbol');

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
			continue; // Skip symbols that don't have any transactions affecting Schedule FA for the year
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

	const priceAtYearEnd = _.maxBy(dailyPricesInYear, 'date')!;
	const exchangeRateAtYearEnd = findRate(rates, priceAtYearEnd.date);

	const sorted = _.sortBy(
		transactions.filter((tx) => tx.date <= calendarYearEnd),
		['date', 'type'],
		['asc', 'desc']
	);

	const buys = sorted.filter((tx) => tx.type === 'Buy');
	const sells = sorted.filter((tx) => tx.type === 'Sell');

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
				continue; // This sale doesn't affect Schedule FA for the year, so skip to next iteration without adding a row
			}

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
						units: dividend.amount,
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
	}

	return rows;
}

function combineRows(rows: RowItem[]): RowItem {
	return {
		...rows[0],
		dateOfAcquiring: _.minBy(rows, 'dateOfAcquiring')!.dateOfAcquiring,
		initials: _.flatMap(rows, 'initials'),
		peaks: _.flatMap(rows, 'peaks'),
		closings: _.flatMap(rows, 'closings'),
		dividends: _.flatMap(rows, 'dividends'),
		saleProceeds: _.flatMap(rows, 'saleProceeds'),
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

	return (closestBefore ?? closestAfter)!;
}

function findPreviousMonthEndRate(
	rates: ExchangeRate[],
	date: string
): ExchangeRate {
	const lastDayOfPrevMonth = DateTime.fromISO(date)
		.startOf('month')
		.minus({ days: 1 })
		.toISODate()!;
	return findRate(rates, lastDayOfPrevMonth);
}

function getDefaultYear(): number {
	return DateTime.now().year - 1;
}

function getYearOptions(): number[] {
	const currentYear = DateTime.now().year;
	const years: number[] = [];
	for (let y = currentYear; y >= 2015; y--) {
		years.push(y);
	}
	return years;
}

function formatAmount(values: DatedValue[]): string {
	const value = _.sumBy(values, (v) => v.units * v.price * v.exchangeRate.rate);
	return `₹${Math.round(value).toLocaleString('en-IN')}`;
}
