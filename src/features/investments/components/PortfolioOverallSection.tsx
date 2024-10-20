import { ColumnDef } from '@tanstack/react-table';
import { OverallPortfolio } from '@/features/investments/lib/types';
import { DataTable } from '@/components/ui/data-table';
import {
	displayCurrencyAmount,
	displayPercentage,
} from '@/features/investments/lib/utils';

const columns: ColumnDef<OverallPortfolio>[] = [
	{
		header: 'Invested Value',
		accessorFn: (data) =>
			displayCurrencyAmount(data.currency, data.initialAmount),
	},
	{
		header: 'Current Value',
		accessorFn: (data) =>
			displayCurrencyAmount(data.currency, data.currentAmount),
	},
	{
		header: 'XIRR (%)',
		accessorFn: (data) => displayPercentage(data.xirrPercent),
	},
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
