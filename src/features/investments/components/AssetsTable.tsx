import { createColumnDef, DataTable } from '@/components/ui/data-table';
import { AssetPortfolio } from '@/features/investments/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import {
	displayInstrumentType,
	displayPercentage,
} from '@/features/investments/lib/utils';
import DeleteAssetDialog from '@/features/investments/components/DeleteAssetDialog';
import { Currency } from '@/lib/types';
import { displayCurrencyAmount } from '@/lib/utils';

type TableItem = AssetPortfolio & { currency: Currency };

const columns: ColumnDef<TableItem>[] = [
	createColumnDef({
		accessorKey: 'asset',
		headerText: 'Asset',
		linkFn: (data) => `/investments/assets/${data.id}`,
		cellTextFn: (data) => data.assetName,
		align: 'left',
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'instrumentName',
		id: 'Instrument Name',
		headerText: 'Instrument Name',
		cellTextFn: (data) => data.instrumentName,
		align: 'left',
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
		accessorKey: 'investedValue',
		id: 'Invested Value',
		headerText: 'Invested Value',
		cellTextFn: (data) =>
			displayCurrencyAmount(data.currency, data.investedValue),
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
		cellTextFn: (data) =>
			displayCurrencyAmount(data.currency, data.currentValue),
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
	{
		id: 'actions',
		cell: ({ row }) => {
			const item = row.original;
			return <DeleteAssetDialog asset={item} currency={item.currency} />;
		},
	},
];

export default function AssetsTable({
	portfolios,
	currency,
}: {
	portfolios: AssetPortfolio[];
	currency: Currency;
}) {
	const items = portfolios.map((portfolio) => ({
		...portfolio,
		currency,
	}));

	return (
		<div className='mx-auto'>
			<DataTable
				columns={columns}
				data={items}
				initialSorting={[
					{
						id: 'investedValuePercent',
						desc: true,
					},
				]}
				doPagination={true}
			/>
		</div>
	);
}
