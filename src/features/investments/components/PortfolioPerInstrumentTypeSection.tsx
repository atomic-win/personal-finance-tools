import {
	InstrumentType,
	InstrumentTypePortfolio,
} from '@/features/investments/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import {
	displayInstrumentType,
	displayPercentage,
} from '@/features/investments/lib/utils';
import { createColumnDef, DataTable } from '@/components/ui/data-table';
import PortfolioCharts from '@/features/investments/components/PortfolioCharts';
import CurrencyAmount from '@/components/CurrencyAmount';

const columns: ColumnDef<InstrumentTypePortfolio>[] = [
	createColumnDef({
		accessorKey: 'instrumentType',
		headerText: 'Instrument Type',
		cellTextFn: (data) => displayInstrumentType(data.id as InstrumentType),
		align: 'left',
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'investedValue',
		id: 'Invested Value',
		headerText: 'Invested Value',
		cellTextFn: (data) => <CurrencyAmount amount={data.investedValue} />,
		sortingFnCompare: (data) => data.investedValue,
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'investedValuePercent',
		headerText: 'Invested Value (%)',
		cellTextFn: (data) => displayPercentage(data.investedValuePercent),
		sortingFnCompare: (data) => data.investedValuePercent,
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'currentValue',
		id: 'Current Value',
		headerText: 'Current Value',
		cellTextFn: (data) => <CurrencyAmount amount={data.currentValue} />,
		sortingFnCompare: (data) => data.currentValue,
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'currentValuePercent',
		headerText: 'Current Value (%)',
		cellTextFn: (data) => displayPercentage(data.currentValuePercent),
		sortingFnCompare: (data) => data.currentValuePercent,
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
			<PortfolioCharts
				portfolios={portfolios}
				labelFn={(portfolio) =>
					displayInstrumentType(portfolio.id as InstrumentType)
				}
			/>
			<DataTable
				columns={columns}
				data={portfolios}
				initialSorting={[
					{
						id: 'investedValuePercent',
						desc: true,
					},
				]}
			/>
		</div>
	);
}
