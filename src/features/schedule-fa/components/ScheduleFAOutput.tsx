import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useTransactionsQuery } from '@/features/schedule-fa/hooks/transactions';
import { useMultipleStockInfo } from '@/features/schedule-fa/hooks/useStockInfo';
import { useMultipleTTBuyRates } from '@/features/schedule-fa/hooks/useTTBuyRate';
import { processTransactions } from '@/features/schedule-fa/lib/csv-parser';
import {
	computeScheduleFARows,
	groupRows,
} from '@/features/schedule-fa/lib/schedule-fa-compute';
import type {
	ExchangeRate,
	GroupingOption,
	ScheduleFARow,
	StockInfoResponse,
} from '@/features/schedule-fa/lib/types';

function formatAmount(value: number): string {
	return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

export default function ScheduleFAOutput({ year }: { year: number }) {
	const [grouping, setGrouping] = useState<GroupingOption>('none');

	const { data: transactions = [] } = useTransactionsQuery();

	const validTransactions = transactions.filter(
		(h) => h.symbol && h.units > 0 && h.date,
	);
	const uniqueSymbols = [...new Set(validTransactions.map((h) => h.symbol))];
	const hasValidTransactions = uniqueSymbols.length > 0;

	const stockQueries = useMultipleStockInfo(
		hasValidTransactions ? uniqueSymbols : [],
	);

	const uniqueCurrencies = [
		...new Set(
			stockQueries
				.filter((q) => q.data?.currency)
				.map((q) => q.data!.currency),
		),
	];

	const rateQueries = useMultipleTTBuyRates(
		uniqueCurrencies,
		hasValidTransactions && uniqueCurrencies.length > 0,
	);

	const isLoading =
		hasValidTransactions &&
		(stockQueries.some((q) => q.isLoading) ||
			rateQueries.some((q) => q.isLoading) ||
			(stockQueries.some((q) => q.isSuccess) &&
				uniqueCurrencies.length === 0));

	const hasError =
		hasValidTransactions &&
		(stockQueries.some((q) => q.isError) || rateQueries.some((q) => q.isError));

	const allDataReady =
		hasValidTransactions &&
		stockQueries.length > 0 &&
		stockQueries.every((q) => q.isSuccess) &&
		rateQueries.length > 0 &&
		rateQueries.every((q) => q.isSuccess);

	let rows: ScheduleFARow[] = [];

	if (allDataReady) {
		const stockData = new Map<string, StockInfoResponse>();
		for (const q of stockQueries) {
			if (q.data) {
				stockData.set(q.symbol, q.data);
			}
		}

		const ratesByCurrency = new Map<string, ExchangeRate[]>();
		for (const q of rateQueries) {
			if (q.data) {
				ratesByCurrency.set(q.currency, q.data);
			}
		}

		if (stockData.size > 0 && ratesByCurrency.size > 0) {
			const { heldLots, soldLots } = processTransactions(validTransactions);

			rows = computeScheduleFARows({
				heldLots,
				soldLots,
				stockData,
				ratesByCurrency,
				year,
			});
		}
	}

	const displayRows = groupRows(rows, grouping);

	if (!hasValidTransactions) return null;

	if (isLoading) {
		return (
			<div className='flex items-center gap-2 text-sm text-muted-foreground p-4'>
				<Spinner className='size-4' />
				Fetching data...
			</div>
		);
	}

	if (hasError) {
		return (
			<div className='p-4'>
				<p className='text-destructive'>
					Failed to fetch some data. Please check your stock symbols and try again.
				</p>
				{stockQueries
					.filter((q) => q.isError)
					.map((q) => (
						<p key={q.symbol} className='text-sm text-destructive'>
							{q.symbol}: {(q.error as Error)?.message ?? 'Unknown error'}
						</p>
					))}
			</div>
		);
	}

	if (rows.length === 0) return null;

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				<h2 className='text-lg font-semibold'>Schedule FA — Table A3 Output</h2>
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
