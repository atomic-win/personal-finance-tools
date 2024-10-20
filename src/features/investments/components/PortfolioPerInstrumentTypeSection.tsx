import {
	InstrumentType,
	InstrumentTypePortfolio,
} from '@/features/investments/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import {
	displayCurrencyAmount,
	displayInstrumentType,
	displayPercentage,
} from '@/features/investments/lib/utils';
import { createColumnDef, DataTable } from '@/components/ui/data-table';

const columns: ColumnDef<InstrumentTypePortfolio>[] = [
	createColumnDef({
		accessorKey: 'instrumentType',
		headerText: 'Instrument Type',
		cellTextFn: (data) => displayInstrumentType(data.id as InstrumentType),
		align: 'left',
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'initialAmount',
		id: 'Invested Value',
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
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'currentAmount',
		id: 'Current Value',
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

export default function PortfolioPerInstrumentTypeSection({
	portfolios,
}: {
	portfolios: InstrumentTypePortfolio[];
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
