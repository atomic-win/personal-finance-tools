import { createColumnDef, DataTable } from '@/components/ui/data-table';
import { AssetPortfolio } from '@/features/investments/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import {
	displayCurrencyAmount,
	displayInstrumentType,
	displayPercentage,
} from '@/features/investments/lib/utils';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

const columns: ColumnDef<AssetPortfolio>[] = [
	createColumnDef({
		accessorKey: 'asset',
		headerText: 'Asset',
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
		cell: () => {
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' className='h-8 w-8 p-0'>
							<span className='sr-only'>Open menu</span>
							<MoreHorizontal className='h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem className='destructive'>Delete</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
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
			/>
		</div>
	);
}
