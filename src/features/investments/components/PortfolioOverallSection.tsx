import { ColumnDef } from '@tanstack/react-table';
import { OverallPortfolio } from '@/features/investments/lib/types';
import { createColumnDef, DataTable } from '@/components/ui/data-table';
import {
	displayCurrencyAmount,
	displayPercentage,
} from '@/features/investments/lib/utils';
import { Currency } from '@/lib/types';

type TableItem = OverallPortfolio & { currency: Currency };

const columns: ColumnDef<TableItem>[] = [
	createColumnDef({
		accessorKey: 'investedValue',
		headerText: 'Initial Value',
		cellTextFn: (data) =>
			displayCurrencyAmount(data.currency, data.investedValue),
		align: 'left',
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'currentValue',
		headerText: 'Current Value',
		cellTextFn: (data) =>
			displayCurrencyAmount(data.currency, data.currentValue),
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
	currency,
}: {
	portfolios: OverallPortfolio[];
	currency: Currency;
}) {
	const items = portfolios.map((portfolio) => ({
		...portfolio,
		currency,
	}));

	return (
		<div className='mx-auto'>
			<DataTable columns={columns} data={items} />
		</div>
	);
}
