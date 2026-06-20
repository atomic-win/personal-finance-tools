import { TableCell, TableRow } from '@/components/ui/table';
import A3TableRowsMessage from '@/features/schedule-fa/components/a3-table-rows-message';
import A3TableValueCell from '@/features/schedule-fa/components/a3-table-value-cell';
import { useTransactionsQuery } from '@/features/schedule-fa/hooks/transactions';
import { useStockInfoQueries } from '@/features/schedule-fa/hooks/use-stock-info';
import { useTTBuyRateQueries } from '@/features/schedule-fa/hooks/use-tt-buy-rate';
import {
	calculateRowItems,
	type GroupingOption,
} from '@/features/schedule-fa/lib/calculations';
import type {
	ExchangeRate,
	StockData,
	Transaction,
} from '@/features/schedule-fa/lib/types';

export default function A3TableRows({
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
		return <A3TableRowsMessage message='Loading stock information...' />;
	}

	if (stockQueries.some((q) => q.isError)) {
		return (
			<>
				<A3TableRowsMessage message='Failed to load stock information. Please check the stock symbols and try again.' />
				{stockQueries
					.filter((q) => q.isError)
					.map((q, i) => (
						<A3TableRowsMessage
							key={i.toString()}
							message={`${uniqueSymbols[i]}: ${(q.error as Error)?.message ?? 'Unknown error'}`}
							className='text-sm text-destructive'
						/>
					))}
			</>
		);
	}

	if (rateQueries.some((q) => q.isLoading)) {
		return <A3TableRowsMessage message='Loading exchange rates...' />;
	}

	if (rateQueries.some((q) => q.isError)) {
		return (
			<>
				<A3TableRowsMessage message='Failed to load exchange rates. Please try again later.' />
				{rateQueries
					.filter((q) => q.isError)
					.map((q, i) => (
						<A3TableRowsMessage
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
			<A3TableRowsMessage message='No valid stock data available to compute Schedule FA.' />
		);
	}

	if (ratesByCurrency.size === 0) {
		return (
			<A3TableRowsMessage message='No valid exchange rate data available to compute Schedule FA.' />
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
			<A3TableRowsMessage message='No transactions affecting Schedule FA for the selected year.' />
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
			<A3TableValueCell values={rowItem.initials} />
			<A3TableValueCell values={rowItem.peaks} />
			<A3TableValueCell values={rowItem.closings} />
			<A3TableValueCell values={rowItem.dividends} />
			<A3TableValueCell values={rowItem.saleProceeds} />
		</TableRow>
	));
}
