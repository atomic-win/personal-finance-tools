import { ColumnDef } from '@tanstack/react-table';
import { OverallPortfolio } from '@/features/investments/lib/types';
import { createColumnDef, DataTable } from '@/components/ui/data-table';
import {
	displayCurrencyAmount,
	displayPercentage,
} from '@/features/investments/lib/utils';

const columns: ColumnDef<OverallPortfolio>[] = [
	createColumnDef({
		accessorKey: 'initialAmount',
		headerText: 'Initial Amount',
		cellTextFn: (data) =>
			displayCurrencyAmount(data.currency, data.initialAmount),
		align: 'left',
	}),
	createColumnDef({
		accessorKey: 'currentAmount',
		headerText: 'Current Amount',
		cellTextFn: (data) =>
			displayCurrencyAmount(data.currency, data.currentAmount),
		align: 'left',
	}),
	createColumnDef({
		accessorKey: 'xirrPercent',
		headerText: 'XIRR (%)',
		cellTextFn: (data) => displayPercentage(data.xirrPercent),
		align: 'left',
	}),
];

export default function PortfolioOverallSection({
	portfolios,
}: {
	portfolios: OverallPortfolio[];
}) {
	return (
		<div className='mx-auto'>
			<DataTable columns={columns} data={portfolios} />
		</div>
	);
}
