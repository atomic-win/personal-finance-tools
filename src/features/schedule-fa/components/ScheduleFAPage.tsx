import { DateTime } from 'luxon';
import { useMemo, useState } from 'react';
import SidebarTriggerWithBreadcrumb from '@/components/sidebar-trigger-with-breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import CSVUploadDialog from '@/features/schedule-fa/components/CSVUploadDialog';
import HoldingsInputTable from '@/features/schedule-fa/components/HoldingsInputTable';
import ScheduleFAOutput from '@/features/schedule-fa/components/ScheduleFAOutput';
import { useMultipleStockInfo } from '@/features/schedule-fa/hooks/useStockInfo';
import { useTTBuyRate } from '@/features/schedule-fa/hooks/useTTBuyRate';
import { processTransactions } from '@/features/schedule-fa/lib/csv-parser';
import { computeScheduleFARows } from '@/features/schedule-fa/lib/schedule-fa-compute';
import type {
	HoldingInput,
	ScheduleFARow,
	StockInfoResponse,
	Transaction,
} from '@/features/schedule-fa/lib/types';

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

export default function ScheduleFAPage() {
	const [year, setYear] = useState(getDefaultYear());
	const [holdings, setHoldings] = useState<HoldingInput[]>([]);
	const [generated, setGenerated] = useState(false);

	const uniqueSymbols = useMemo(
		() => [...new Set(holdings.map((h) => h.symbol).filter(Boolean))],
		[holdings]
	);

	const stockQueries = useMultipleStockInfo(generated ? uniqueSymbols : []);
	const ttBuyRateQuery = useTTBuyRate('USD', generated);

	const isLoading =
		generated &&
		(stockQueries.some((q) => q.isLoading) || ttBuyRateQuery.isLoading);

	const hasError =
		generated &&
		(stockQueries.some((q) => q.isError) || ttBuyRateQuery.isError);

	const rows: ScheduleFARow[] = useMemo(() => {
		if (!generated) return [];
		if (isLoading || hasError) return [];

		const stockData = new Map<string, StockInfoResponse>();
		for (const q of stockQueries) {
			if (q.data) {
				stockData.set(q.symbol, q.data);
			}
		}

		const rates = ttBuyRateQuery.data ?? [];
		if (stockData.size === 0 || rates.length === 0) return [];

		// Convert holdings to transactions and apply FIFO
		const transactions: Transaction[] = holdings
			.filter((h) => h.symbol && h.quantity > 0 && h.purchaseDate)
			.map((h) => ({
				date: h.purchaseDate,
				remarks: '',
				symbol: h.symbol,
				type: h.type,
				units: h.quantity,
				price: h.purchasePrice,
			}));

		const { heldLots, soldLots } = processTransactions(transactions);

		return computeScheduleFARows({
			heldLots,
			soldLots,
			stockData,
			rates,
			year,
		});
	}, [
		generated,
		isLoading,
		hasError,
		stockQueries,
		ttBuyRateQuery.data,
		holdings,
		year,
	]);

	const handleGenerate = () => {
		const validHoldings = holdings.filter(
			(h) => h.symbol && h.quantity > 0 && h.purchaseDate
		);
		if (validHoldings.length === 0) return;
		setGenerated(true);
	};

	const handleCSVImport = (imported: HoldingInput[]) => {
		setHoldings((prev) => [...prev, ...imported]);
		setGenerated(false);
	};

	const handleHoldingsChange = (updated: HoldingInput[]) => {
		setHoldings(updated);
		setGenerated(false);
	};

	const validCount = holdings.filter(
		(h) => h.symbol && h.quantity > 0 && h.purchaseDate
	).length;

	return (
		<>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{ title: 'ITR Tools', href: '', disabled: true },
					{ title: 'Schedule FA — A3', href: '/itr/schedule-fa/a3' },
				]}
			/>
			<div className='px-4 pb-8 space-y-6'>
				<div>
					<h1 className='text-2xl font-bold'>Schedule FA — Table A3</h1>
					<p className='text-muted-foreground'>
						Generate the Foreign Equity & Debt Interest (Direct Holdings)
						section for your ITR filing. Reporting period follows the calendar
						year (Jan 1 – Dec 31).
					</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className='flex items-center justify-between'>
							<span>Holdings</span>
							<div className='flex items-center gap-3'>
								<div className='flex items-center gap-2'>
									<span className='text-sm font-normal text-muted-foreground'>
										Reporting Year:
									</span>
									<Select
										value={String(year)}
										onValueChange={(v) => {
											setYear(Number(v));
											setGenerated(false);
										}}
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
								<CSVUploadDialog onImport={handleCSVImport} />
							</div>
						</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<HoldingsInputTable
							holdings={holdings}
							onChange={handleHoldingsChange}
						/>
						<div className='flex justify-end'>
							<Button
								onClick={handleGenerate}
								disabled={validCount === 0 || isLoading}
							>
								{isLoading ? (
									<>
										<Spinner className='size-4' />
										Fetching data...
									</>
								) : (
									`Generate Schedule FA (${validCount} holdings)`
								)}
							</Button>
						</div>
					</CardContent>
				</Card>

				{hasError && (
					<Card>
						<CardContent>
							<p className='text-destructive'>
								Failed to fetch some data. Please check your stock symbols and
								try again.
							</p>
							{stockQueries
								.filter((q) => q.isError)
								.map((q) => (
									<p key={q.symbol} className='text-sm text-destructive'>
										{q.symbol}: {(q.error as Error)?.message ?? 'Unknown error'}
									</p>
								))}
						</CardContent>
					</Card>
				)}

				{!isLoading && rows.length > 0 && (
					<Card>
						<CardContent>
							<ScheduleFAOutput rows={rows} />
						</CardContent>
					</Card>
				)}
			</div>
		</>
	);
}
