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
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

const columns: ColumnDef<InstrumentTypePortfolio>[] = [
	{
		accessorKey: 'instrumentType',
		header: () => {
			return (
				<Button variant='ghost' className='p-0'>
					Instrument Type
				</Button>
			);
		},
		cell: ({ row }) => {
			return (
				<div className='text-left font-medium'>
					{displayInstrumentType(row.original.id as InstrumentType)}
				</div>
			);
		},
	},
	{
		accessorKey: 'initialAmount',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='p-0'>
					Invested Value
					{column.getIsSorted() === 'asc' && <ArrowDown className='h-4 w-4' />}
					{column.getIsSorted() === 'desc' && <ArrowUp className='h-4 w-4' />}
					{column.getIsSorted() === false && (
						<ArrowUpDown className='h-4 w-4' />
					)}
				</Button>
			);
		},
		cell: ({ row }) => {
			return (
				<div className='text-right font-medium'>
					{displayCurrencyAmount(
						row.original.currency,
						row.original.initialAmount
					)}
				</div>
			);
		},
		sortingFn: (a, b) => {
			return a.original.initialAmount - b.original.initialAmount;
		},
	},
	{
		accessorKey: 'initialAmountPercent',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='p-0'>
					Invested Value (%)
					{column.getIsSorted() === 'asc' && <ArrowDown className='h-4 w-4' />}
					{column.getIsSorted() === 'desc' && <ArrowUp className='h-4 w-4' />}
					{column.getIsSorted() === false && (
						<ArrowUpDown className='h-4 w-4' />
					)}
				</Button>
			);
		},
		cell: ({ row }) => {
			return (
				<div className='text-right font-medium'>
					{displayPercentage(row.original.initialAmountPercent)}
				</div>
			);
		},
		sortingFn: (a, b) => {
			return a.original.initialAmountPercent - b.original.initialAmountPercent;
		},
	},
	{
		accessorKey: 'currentAmount',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='p-0'>
					Current Value
					{column.getIsSorted() === 'asc' && <ArrowDown className='h-4 w-4' />}
					{column.getIsSorted() === 'desc' && <ArrowUp className='h-4 w-4' />}
					{column.getIsSorted() === false && (
						<ArrowUpDown className='h-4 w-4' />
					)}
				</Button>
			);
		},
		cell: ({ row }) => {
			return (
				<div className='text-right font-medium'>
					{displayCurrencyAmount(
						row.original.currency,
						row.original.currentAmount
					)}
				</div>
			);
		},
		sortingFn: (a, b) => {
			return a.original.currentAmount - b.original.currentAmount;
		},
	},
	{
		accessorKey: 'currentAmountPercent',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='p-0'>
					Current Value (%)
					{column.getIsSorted() === 'asc' && <ArrowDown className='h-4 w-4' />}
					{column.getIsSorted() === 'desc' && <ArrowUp className='h-4 w-4' />}
					{column.getIsSorted() === false && (
						<ArrowUpDown className='h-4 w-4' />
					)}
				</Button>
			);
		},
		cell: ({ row }) => {
			return (
				<div className='text-right font-medium'>
					{displayPercentage(row.original.currentAmountPercent)}
				</div>
			);
		},
		sortingFn: (a, b) => {
			return a.original.currentAmountPercent - b.original.currentAmountPercent;
		},
	},
	{
		accessorKey: 'xirrPercent',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='p-0'>
					XIRR (%)
					{column.getIsSorted() === 'asc' && <ArrowDown className='h-4 w-4' />}
					{column.getIsSorted() === 'desc' && <ArrowUp className='h-4 w-4' />}
					{column.getIsSorted() === false && (
						<ArrowUpDown className='h-4 w-4' />
					)}
				</Button>
			);
		},
		cell: ({ row }) => {
			return (
				<div className='text-right font-medium'>
					{displayPercentage(row.original.xirrPercent)}
				</div>
			);
		},
		sortingFn: (a, b) => {
			return a.original.xirrPercent - b.original.xirrPercent;
		},
	},
];

export default function PortfolioPerInstrumentTypeSection({
	portfolios,
}: {
	portfolios: InstrumentTypePortfolio[];
}) {
	return (
		<div className='mx-auto'>
			<DataTable columns={columns} data={portfolios} />
		</div>
	);
}
