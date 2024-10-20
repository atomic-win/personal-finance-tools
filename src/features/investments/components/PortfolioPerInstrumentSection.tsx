import { createColumnDef, DataTable } from '@/components/ui/data-table';
import { InstrumentPortfolio } from '@/features/investments/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import {
	displayCurrencyAmount,
	displayInstrumentType,
	displayPercentage,
} from '@/features/investments/lib/utils';

const columns: ColumnDef<InstrumentPortfolio>[] = [
	createColumnDef({
		accessorKey: 'instrument',
		headerText: 'Instrument',
		cellTextFn: (data) => data.instrumentName,
		align: 'left',
	}),
	createColumnDef({
		accessorKey: 'instrumentType',
		headerText: 'Instrument Type',
		cellTextFn: (data) => displayInstrumentType(data.instrumentType),
		sortingFnCompare: (data) => data.instrumentType,
		align: 'left',
	}),
	createColumnDef({
		accessorKey: 'initialAmount',
		headerText: 'Invested Value',
		cellTextFn: (data) =>
			displayCurrencyAmount(data.currency, data.initialAmount),
		sortingFnCompare: (data) => data.initialAmount,
	}),
	createColumnDef({
		accessorKey: 'initialAmountPercent',
		headerText: 'Invested Value (%)',
		cellTextFn: (data) => displayPercentage(data.initialAmountPercent),
		sortingFnCompare: (data) => data.initialAmountPercent,
	}),
	createColumnDef({
		accessorKey: 'currentAmount',
		headerText: 'Current Value',
		cellTextFn: (data) =>
			displayCurrencyAmount(data.currency, data.currentAmount),
		sortingFnCompare: (data) => data.currentAmount,
	}),
	createColumnDef({
		accessorKey: 'currentAmountPercent',
		headerText: 'Current Value (%)',
		cellTextFn: (data) => displayPercentage(data.currentAmountPercent),
		sortingFnCompare: (data) => data.currentAmountPercent,
	}),
	createColumnDef({
		accessorKey: 'xirrPercent',
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
