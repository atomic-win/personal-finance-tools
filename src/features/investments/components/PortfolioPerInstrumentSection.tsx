import { createColumnDef, DataTable } from '@/components/ui/data-table';
import { InstrumentPortfolio } from '@/features/investments/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import {
	displayCurrencyAmount,
	displayInstrumentType,
	displayPercentage,
} from '@/features/investments/lib/utils';
import PortfolioCharts from '@/features/investments/components/PortfolioCharts';
import { Currency } from '@/lib/types';

type TableItem = InstrumentPortfolio & { currency: Currency };

const columns: ColumnDef<TableItem>[] = [
	createColumnDef({
		accessorKey: 'instrument',
		headerText: 'Instrument',
		cellTextFn: (data) => data.instrumentName,
		align: 'left',
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'instrumentType',
		id: 'Instrument Type',
		headerText: 'Instrument Type',
		cellTextFn: (data) => displayInstrumentType(data.instrumentType),
		sortingFnCompare: (data) => data.instrumentType,
		align: 'left',
	}),
	createColumnDef({
		accessorKey: 'initialAmount',
		id: 'Invested Value',
		headerText: 'Invested Value',
		cellTextFn: (data) =>
			displayCurrencyAmount(data.currency, data.initialAmount),
		sortingFnCompare: (data) => data.initialAmount,
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'initialAmountPercent',
		headerText: 'Invested Value (%)',
		cellTextFn: (data) => displayPercentage(data.initialAmountPercent),
		sortingFnCompare: (data) => data.initialAmountPercent,
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'currentAmount',
		id: 'Current Value',
		headerText: 'Current Value',
		cellTextFn: (data) =>
			displayCurrencyAmount(data.currency, data.currentAmount),
		sortingFnCompare: (data) => data.currentAmount,
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'currentAmountPercent',
		headerText: 'Current Value (%)',
		cellTextFn: (data) => displayPercentage(data.currentAmountPercent),
		sortingFnCompare: (data) => data.currentAmountPercent,
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'xirrPercent',
		headerText: 'XIRR (%)',
		cellTextFn: (data) => displayPercentage(data.xirrPercent),
		sortingFnCompare: (data) => data.xirrPercent,
		enableHiding: false,
	}),
];

export default function PortfolioPerInstrumentSection({
	portfolios,
	currency,
}: {
	portfolios: InstrumentPortfolio[];
	currency: Currency;
}) {
	const items = portfolios.map((portfolio) => ({
		...portfolio,
		currency,
	}));

	return (
		<div className='mx-auto'>
			<PortfolioCharts
				portfolios={portfolios}
				labelFn={(portfolio) => portfolio.instrumentName}
			/>
			<DataTable
				columns={columns}
				data={items}
				initialSorting={[
					{
						id: 'initialAmountPercent',
						desc: true,
					},
				]}
				initialColumnVisibility={{
					'Instrument Type': false,
				}}
			/>
		</div>
	);
}
