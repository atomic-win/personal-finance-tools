import { ColumnDef } from '@tanstack/react-table';
import { OverallPortfolio } from '@/features/investments/lib/types';
import { createColumnDef, DataTable } from '@/components/ui/data-table';
import { displayPercentage } from '@/features/investments/lib/utils';
import CurrencyAmount from '@/components/CurrencyAmount';

const columns: ColumnDef<OverallPortfolio>[] = [
	createColumnDef({
		accessorKey: 'investedValue',
		headerText: 'Initial Value',
		cellTextFn: (data) => <CurrencyAmount amount={data.investedValue} />,
		align: 'left',
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'currentValue',
		headerText: 'Current Value',
		cellTextFn: (data) => <CurrencyAmount amount={data.currentValue} />,
		align: 'left',
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'xirrPercent',
		headerText: 'XIRR (%)',
		cellTextFn: (data) => displayPercentage(data.xirrPercent),
		align: 'left',
		enableHiding: false,
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
