import _ from 'lodash';
import { DateTime } from 'luxon';
import { useState } from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTransactionsQuery } from '@/features/schedule-fa/hooks/transactions';
import { useStockInfoQueries } from '@/features/schedule-fa/hooks/useStockInfo';
import { useTTBuyRateQueries } from '@/features/schedule-fa/hooks/useTTBuyRate';
import type {
	ExchangeRate,
	StockData,
	Transaction,
} from '@/features/schedule-fa/lib/types';
import { cn } from '@/lib/utils';

type GroupingOption = 'none' | 'by-stock' | 'by-year';

export default function ScheduleFAOutput() {
	const [year, setYear] = useState(getDefaultYear());
	const [grouping, setGrouping] = useState<GroupingOption>('none');

	const { isLoading: isLoadingTransactions, data: transactions = [] } =
		useTransactionsQuery();

	if (isLoadingTransactions) {
		return null; // Don't show loading state for transactions, as the input table already has one
	}

	const validTransactions = transactions.filter(
		(h) => h.symbol && h.units > 0 && h.date
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
								{getYearOptions(validTransactions).map((y) => (
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
								<SelectValue placeholder='Select grouping'>
									{displayGrouping(grouping)}
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='none'>{displayGrouping('none')}</SelectItem>
								<SelectItem value='by-stock'>
									{displayGrouping('by-stock')}
								</SelectItem>
								<SelectItem value='by-year'>
									{displayGrouping('by-year')}
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			<div className='border rounded-lg max-h-96 overflow-auto'>
				<table className='w-full caption-bottom text-sm'>
					<thead className='sticky top-0 z-10 bg-background shadow-[inset_0_-1px_0_0_var(--color-border)]'>
						<tr>
							<th className='h-10 px-2 text-center align-middle font-medium whitespace-nowrap'>
								Sl. No
							</th>
							<th className='h-10 px-2 text-left align-middle font-medium whitespace-nowrap'>
								Country Name & Code
							</th>
							<th className='h-10 px-2 text-left align-middle font-medium whitespace-nowrap'>
								Name of Entity
							</th>
							<th className='h-10 px-2 text-left align-middle font-medium whitespace-nowrap'>
								Address of Entity
							</th>
							<th className='h-10 px-2 text-left align-middle font-medium whitespace-nowrap'>
								Zip Code
							</th>
							<th className='h-10 px-2 text-left align-middle font-medium whitespace-nowrap'>
								Nature of Entity
							</th>
							<th className='h-10 px-2 text-left align-middle font-medium whitespace-nowrap'>
								Date of Acquiring
							</th>
							<th className='h-10 px-2 text-right align-middle font-medium whitespace-nowrap'>
								Initial Value
							</th>
							<th className='h-10 px-2 text-right align-middle font-medium whitespace-nowrap'>
								Peak Value
							</th>
							<th className='h-10 px-2 text-right align-middle font-medium whitespace-nowrap'>
								Closing Balance
							</th>
							<th className='h-10 px-2 text-right align-middle font-medium whitespace-nowrap'>
								Dividends
							</th>
							<th className='h-10 px-2 text-right align-middle font-medium whitespace-nowrap'>
								Sale Proceeds
							</th>
						</tr>
					</thead>
					<TableBody>
						<A3TableRows
							transactions={validTransactions}
							year={year}
							grouping={grouping}
						/>
					</TableBody>
				</table>
			</div>
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

function A3TableRows({
	transactions,
	year,
	grouping,
}: {
	transactions: Transaction[];
	year: number;
	grouping: GroupingOption;
}) {
	const uniqueSymbols = [...new Set(transactions.map((h) => h.symbol))];

	const stockQueries = useStockInfoQueries(uniqueSymbols);

	const uniqueCurrencies = [
		...new Set(
			stockQueries.map((q) => q.data?.currency).filter(Boolean) as string[]
		),
	];

	const rateQueries = useTTBuyRateQueries(uniqueCurrencies);

	if (stockQueries.some((q) => q.isLoading)) {
		return <TableRowsMessage message='Loading stock information...' />;
	}

	if (stockQueries.some((q) => q.isError)) {
		return (
			<>
				<TableRowsMessage message='Failed to load stock information. Please check the stock symbols and try again.' />
				{stockQueries
					.filter((q) => q.isError)
					.map((q, i) => (
						<TableRowsMessage
							key={i.toString()}
							message={`${uniqueSymbols[i]}: ${(q.error as Error)?.message ?? 'Unknown error'}`}
							className='text-sm text-destructive'
						/>
					))}
			</>
		);
	}

	if (rateQueries.some((q) => q.isLoading)) {
		return <TableRowsMessage message='Loading exchange rates...' />;
	}

	if (rateQueries.some((q) => q.isError)) {
		return (
			<>
				<TableRowsMessage message='Failed to load exchange rates. Please try again later.' />
				{rateQueries
					.filter((q) => q.isError)
					.map((q, i) => (
						<TableRowsMessage
							key={i.toString()}
							message={`${uniqueCurrencies[i]}: ${(q.error as Error)?.message ?? 'Unknown error'}`}
							className='text-sm text-destructive'
						/>
					))}
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

	if (stockData.size === 0) {
		return (
			<TableRowsMessage message='No valid stock data available to compute Schedule FA.' />
		);
	}

	if (ratesByCurrency.size === 0) {
		return (
			<TableRowsMessage message='No valid exchange rate data available to compute Schedule FA.' />
		);
	}

	const rowItems = calculateRowItems(
		transactions,
		stockData,
		ratesByCurrency,
		year,
		grouping
	);

	if (rowItems.length === 0) {
		return (
			<TableRowsMessage message='No transactions affecting Schedule FA for the selected year.' />
		);
	}

	return rowItems.map((rowItem, index) => (
		<TableRow key={index.toString()}>
			<TableCell className='text-center'>{index + 1}</TableCell>
			<TableCell>{rowItem.countryNameAndCode}</TableCell>
			<TableCell>{rowItem.nameOfEntity}</TableCell>
			<TableCell>{rowItem.addressOfEntity}</TableCell>
			<TableCell>{rowItem.zipCode || '—'}</TableCell>
			<TableCell>{rowItem.natureOfEntity}</TableCell>
			<TableCell>{rowItem.dateOfAcquiring}</TableCell>
			<ValueCell values={rowItem.initials} />
			<ValueCell values={rowItem.peaks} />
			<ValueCell values={rowItem.closings} />
			<ValueCell values={rowItem.dividends} />
			<ValueCell values={rowItem.saleProceeds} />
		</TableRow>
	));
}

function TableRowsMessage({
	message,
	className,
}: {
	message: string;
	className?: string;
}) {
	return (
		<TableRow>
			<TableCell
				colSpan={15}
				className={cn('text-center text-muted-foreground', className)}
			>
				{message}
			</TableCell>
		</TableRow>
	);
}

function calculateRowItems(
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
		); // This is critical for calculations, so we throw an error instead of just skipping
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
				continue; // This sale doesn't affect Schedule FA for the year, so skip to next iteration without adding a row
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

function getDefaultYear(): number {
	return DateTime.now().year - 1;
}

function getYearOptions(transactions: Transaction[]): number[] {
	const currentYear = DateTime.now().year;
	const minYearFromTransactions = _.minBy(transactions, 'date')?.date;

	const years: number[] = [];
	for (
		let y = currentYear;
		y >=
		(minYearFromTransactions
			? DateTime.fromISO(minYearFromTransactions).year
			: currentYear);
		y--
	) {
		years.push(y);
	}
	return years;
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

function formatAmount(values: DatedValue[]): string {
	const value = _.sumBy(values, (v) => v.units * v.price * v.exchangeRate.rate);
	return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

function ValueCell({ values }: { values: DatedValue[] }) {
	if (values.length === 0) {
		return <TableCell className='text-right'>₹0</TableCell>;
	}

	return (
		<TableCell className='text-right'>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger className='cursor-help underline decoration-dotted underline-offset-4'>
						{formatAmount(values)}
					</TooltipTrigger>
					<TooltipContent className='max-w-sm'>
						<table className='text-xs'>
							<thead>
								<tr>
									<th className='pr-3 text-left'>Date</th>
									<th className='pr-3 text-right'>Units</th>
									<th className='pr-3 text-right'>Price</th>
									<th className='pr-3 text-left'>TTBR Date</th>
									<th className='pr-3 text-right'>TTBR</th>
									<th className='text-right'>INR</th>
								</tr>
							</thead>
							<tbody>
								{values.map((v, i) => (
									<tr key={i.toString()}>
										<td className='pr-3'>{v.date}</td>
										<td className='pr-3 text-right'>
											{Number(v.units.toFixed(3))}
										</td>
										<td className='pr-3 text-right'>
											{Number(v.price.toFixed(2))}
										</td>
										<td className='pr-3'>{v.exchangeRate.date}</td>
										<td className='pr-3 text-right'>
											{Number(v.exchangeRate.rate.toFixed(2))}
										</td>
										<td className='text-right'>
											₹
											{Math.round(
												v.units * v.price * v.exchangeRate.rate
											).toLocaleString('en-IN')}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</TableCell>
	);
}

function displayGrouping(option: GroupingOption): string {
	switch (option) {
		case 'none':
			return 'No Grouping';
		case 'by-stock':
			return 'By Stock';
		case 'by-year':
			return 'By Acquisition Year';
	}
}
