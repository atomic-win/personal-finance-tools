import {
	createNormalColumnDef,
	createSortableColumnDef,
	DataTable,
} from '@/components/ui/data-table';
import { InstrumentPortfolio } from '@/features/investments/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import {
	displayCurrencyAmount,
	displayInstrumentType,
	displayPercentage,
} from '@/features/investments/lib/utils';

const columns: ColumnDef<InstrumentPortfolio>[] = [
	createNormalColumnDef({
		accessorKey: 'Instrument',
		headerText: 'Instrument',
		cellTextFn: (data) => data.instrumentName,
	}),
	createSortableColumnDef({
		accessorKey: 'Instrument Type',
		headerText: 'Instrument Type',
		cellTextFn: (data) => displayInstrumentType(data.instrumentType),
		sortingFnCompare: (data) => data.instrumentType,
	}),
	createSortableColumnDef({
		accessorKey: 'Invested Value',
		headerText: 'Invested Value',
		cellTextFn: (data) =>
			displayCurrencyAmount(data.currency, data.initialAmount),
		sortingFnCompare: (data) => data.initialAmount,
	}),
	createSortableColumnDef({
		accessorKey: 'Invested Value (%)',
		headerText: 'Invested Value (%)',
		cellTextFn: (data) => displayPercentage(data.initialAmountPercent),
		sortingFnCompare: (data) => data.initialAmountPercent,
	}),
	createSortableColumnDef({
		accessorKey: 'Current Value',
		headerText: 'Current Value',
		cellTextFn: (data) =>
			displayCurrencyAmount(data.currency, data.currentAmount),
		sortingFnCompare: (data) => data.currentAmount,
	}),
	createSortableColumnDef({
		accessorKey: 'Current Value (%)',
		headerText: 'Current Value (%)',
		cellTextFn: (data) => displayPercentage(data.currentAmountPercent),
		sortingFnCompare: (data) => data.currentAmountPercent,
	}),
	createSortableColumnDef({
		accessorKey: 'XIRR (%)',
		headerText: 'XIRR (%)',
		cellTextFn: (data) => displayPercentage(data.xirrPercent),
		sortingFnCompare: (data) => data.xirrPercent,
	}),
];

export default function PortfolioPerInstrumentSection({
	portfolios,
}: {
	portfolios: InstrumentPortfolio[];
}) {
	return (
		<div className='mx-auto'>
			<DataTable
				columns={columns}
				data={portfolios}
				initialSorting={[
					{
						id: 'initialAmountPercent',
						desc: true,
					},
				]}
			/>
		</div>
	);
}
