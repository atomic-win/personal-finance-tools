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
	GroupingOption,
	ScheduleFARow,
	StockInfoResponse,
	Transaction,
} from '@/features/schedule-fa/lib/types';

export default function ScheduleFAOutput() {
	const [year, setYear] = useState(getDefaultYear());
	const [grouping, setGrouping] = useState<GroupingOption>('none');

	const { data: transactions = [] } = useTransactionsQuery();

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

	if (stockQueries.some((q) => q.isLoading)) {
		return <LoadingComponent loadingMessage='Fetching stock information...' />;
	}

	if (stockQueries.some((q) => q.isError)) {
		return (
			<>
				<ErrorComponent errorMessage='Failed to fetch stock information. Please check the stock symbols and try again.' />
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
		return <LoadingComponent loadingMessage='Fetching exchange rates...' />;
	}

	if (rateQueries.some((q) => q.isError)) {
		return (
			<>
				<ErrorComponent errorMessage='Failed to fetch exchange rates. Please try again later.' />
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

	const stockData = new Map<string, StockInfoResponse>();
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

	const { heldLots, soldLots } = processTransactions(validTransactions);

	const rows = computeScheduleFARows({
		heldLots,
		soldLots,
		stockData,
		ratesByCurrency,
		year,
	});

	const displayRows = groupRows(rows, grouping);

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
						{displayRows.map((row) => (
							<TableRow key={row.slNo}>
								<TableCell className='text-center'>{row.slNo}</TableCell>
								<TableCell>{row.countryNameAndCode}</TableCell>
								<TableCell>{row.nameOfEntity}</TableCell>
								<TableCell>{row.addressOfEntity}</TableCell>
								<TableCell>{row.zipCode || '—'}</TableCell>
								<TableCell>{row.natureOfEntity}</TableCell>
								<TableCell>{row.dateOfAcquiring}</TableCell>
								<TableCell className='text-right'>
									{formatAmount(row.initialValueINR)}
								</TableCell>
								<TableCell className='text-right'>
									{formatAmount(row.peakValueINR)}
								</TableCell>
								<TableCell className='text-right'>
									{formatAmount(row.closingBalanceINR)}
								</TableCell>
								<TableCell className='text-right'>
									{formatAmount(row.totalDividendsINR)}
								</TableCell>
								<TableCell className='text-right'>
									{formatAmount(row.totalSaleProceedsINR)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</ScrollArea>
		</div>
	);
}

// --- Local types ---

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

// --- FIFO lot matching ---

function applyFIFO(transactions: Transaction[]): {
	heldLots: Lot[];
	soldLots: Lot[];
} {
	const sorted = [...transactions].sort(
		(a, b) =>
			DateTime.fromISO(a.date).toMillis() - DateTime.fromISO(b.date).toMillis()
	);

	const buyLots: { date: string; price: number; remaining: number }[] = [];
	const soldLots: Lot[] = [];

	for (const tx of sorted) {
		if (tx.type === 'Buy') {
			buyLots.push({ date: tx.date, price: tx.price, remaining: tx.units });
		} else {
			let unitsToSell = tx.units;
			for (const lot of buyLots) {
				if (unitsToSell <= 0) break;
				if (lot.remaining <= 0) continue;

				const soldFromLot = Math.min(lot.remaining, unitsToSell);
				lot.remaining -= soldFromLot;
				unitsToSell -= soldFromLot;

				soldLots.push({
					symbol: tx.symbol,
					acquiredOn: lot.date,
					quantity: soldFromLot,
					purchasePrice: lot.price,
					soldOn: tx.date,
					salePrice: tx.price,
				});
			}

			if (unitsToSell > 0) {
				throw new Error(
					`Cannot sell ${tx.units} units of ${tx.symbol} on ${tx.date}: insufficient units`
				);
			}
		}
	}

	const heldLots: Lot[] = buyLots
		.filter((lot) => lot.remaining > 0)
		.map((lot) => ({
			symbol: sorted[0].symbol,
			acquiredOn: lot.date,
			quantity: lot.remaining,
			purchasePrice: lot.price,
			soldOn: null,
			salePrice: null,
		}));

	return { heldLots, soldLots };
}

function processTransactions(transactions: Transaction[]): {
	heldLots: Lot[];
	soldLots: Lot[];
} {
	const bySymbol = new Map<string, typeof transactions>();
	for (const tx of transactions) {
		const existing = bySymbol.get(tx.symbol) ?? [];
		existing.push(tx);
		bySymbol.set(tx.symbol, existing);
	}

	const allHeldLots: Lot[] = [];
	const allSoldLots: Lot[] = [];

	for (const [, txns] of bySymbol) {
		const { heldLots, soldLots } = applyFIFO(txns);
		allHeldLots.push(...heldLots);
		allSoldLots.push(...soldLots);
	}

	return { heldLots: allHeldLots, soldLots: allSoldLots };
}

// --- Computation helpers ---

function findRate(rates: ExchangeRate[], date: string): number {
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

function getLastDayOfPreviousMonth(dateStr: string): string {
	const dt = DateTime.fromISO(dateStr);
	const lastDay = dt.startOf('month').minus({ days: 1 });
	return lastDay.toISODate() ?? dateStr;
}

function findPeakPrice(
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

function findClosingPrice(
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

function computeScheduleFARows(input: {
	heldLots: Lot[];
	soldLots: Lot[];
	stockData: Map<string, StockInfoResponse>;
	ratesByCurrency: Map<string, ExchangeRate[]>;
	year: number;
}): ScheduleFARow[] {
	const { heldLots, soldLots, stockData, ratesByCurrency, year } = input;
	const yearStart = `${year}-01-01`;
	const yearEnd = `${year}-12-31`;

	const rows: ScheduleFARow[] = [];
	let slNo = 1;

	const soldBySymbol = new Map<string, Lot[]>();
	for (const lot of soldLots) {
		const existing = soldBySymbol.get(lot.symbol) ?? [];
		existing.push(lot);
		soldBySymbol.set(lot.symbol, existing);
	}

	for (const lot of heldLots) {
		if (lot.acquiredOn > yearEnd) continue;

		const stock = stockData.get(lot.symbol);
		if (!stock) continue;

		const rates = ratesByCurrency.get(stock.currency) ?? [];

		const peakFrom = lot.acquiredOn > yearStart ? lot.acquiredOn : yearStart;
		const { peakPrice, peakDate } = findPeakPrice(
			stock.dailyPrices,
			peakFrom,
			yearEnd
		);
		const { closingPrice } = findClosingPrice(stock.dailyPrices, yearEnd);

		const initialValueForeign = lot.purchasePrice * lot.quantity;
		const initialRate = findRate(rates, lot.acquiredOn);
		const peakValueForeign = peakPrice * lot.quantity;
		const peakRate = findRate(rates, peakDate);
		const closingBalanceForeign = closingPrice * lot.quantity;
		const closingRate = findRate(rates, yearEnd);

		const divs = computeDividends(
			stock.dividends,
			lot.quantity,
			year,
			rates,
			lot.acquiredOn,
			lot.soldOn ?? yearEnd
		);

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

function groupRows(
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
			initialValueForeign: sumField(group, 'initialValueForeign'),
			initialValueINR: sumField(group, 'initialValueINR'),
			peakValueForeign: sumField(group, 'peakValueForeign'),
			peakValueINR: sumField(group, 'peakValueINR'),
			closingBalanceForeign: sumField(group, 'closingBalanceForeign'),
			closingBalanceINR: sumField(group, 'closingBalanceINR'),
			totalDividendsForeign: sumField(group, 'totalDividendsForeign'),
			totalDividendsINR: sumField(group, 'totalDividendsINR'),
			totalSaleProceedsForeign: sumField(group, 'totalSaleProceedsForeign'),
			totalSaleProceedsINR: sumField(group, 'totalSaleProceedsINR'),
		});
	}

	return grouped;
}

function sumField(rows: ScheduleFARow[], key: keyof ScheduleFARow): number {
	return rows.reduce((acc, r) => acc + (r[key] as number), 0);
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

function formatAmount(value: number): string {
	return `₹${Math.round(value).toLocaleString('en-IN')}`;
}
