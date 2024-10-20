import { ColumnDef } from '@tanstack/react-table';
import { OverallPortfolio } from '@/features/investments/lib/types';
import { createNormalColumnDef, DataTable } from '@/components/ui/data-table';
import {
	displayCurrencyAmount,
	displayPercentage,
} from '@/features/investments/lib/utils';

const columns: ColumnDef<OverallPortfolio>[] = [
	createNormalColumnDef({
		accessorKey: 'initialAmount',
		headerText: 'Initial Amount',
		cellTextFn: (data) =>
			displayCurrencyAmount(data.currency, data.initialAmount),
	}),
	createNormalColumnDef({
		accessorKey: 'currentAmount',
		headerText: 'Current Amount',
		cellTextFn: (data) =>
			displayCurrencyAmount(data.currency, data.currentAmount),
	}),
	createNormalColumnDef({
		accessorKey: 'xirrPercent',
		headerText: 'XIRR (%)',
		cellTextFn: (data) => displayPercentage(data.xirrPercent),
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
