import { createColumnDef, DataTable } from '@/components/ui/data-table';
import { AssetPortfolio } from '@/features/investments/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import {
	displayCurrencyAmount,
	displayInstrumentType,
	displayPercentage,
} from '@/features/investments/lib/utils';
import DeleteAssetDialog from '@/features/investments/components/DeleteAssetDialog';

const columns: ColumnDef<AssetPortfolio>[] = [
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
		accessorKey: 'initialAmount',
		id: 'Invested Value',
		headerText: 'Invested Value',
		cellTextFn: (data) =>
			displayCurrencyAmount(data.currency, data.initialAmount),
		sortingFnCompare: (data) => data.initialAmount,
		enableHiding: false,
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
		enableHiding: false,
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
	{
		id: 'actions',
		cell: ({ row }) => {
			const asset = row.original;
			return <DeleteAssetDialog asset={asset} />;
		},
	},
];

export default function AssetsTable({
	portfolios,
}: {
	portfolios: AssetPortfolio[];
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
				doPagination={true}
			/>
		</div>
	);
}
