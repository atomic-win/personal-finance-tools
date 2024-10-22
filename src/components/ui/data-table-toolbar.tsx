'use client';

import { Table } from '@tanstack/react-table';
import { DataTableViewOptions } from '@/components/ui/data-table-view-options';
import { DataTableFacetedFilter } from '@/components/ui/data-table-faceted-filter';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

export function DataTableToolbar<TData>({
	table,
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0;

	return (
		<div className='flex items-center justify-between'>
			<div className='flex flex-1 items-center space-x-2'>
				{table.getColumn('Transaction Type') && (
					<DataTableFacetedFilter
						column={table.getColumn('Transaction Type')}
						title='Transaction Type'
						options={[
							{ label: 'Buy', value: 'Buy' },
							{ label: 'Sell', value: 'Sell' },
							{ label: 'Dividend', value: 'Dividend' },
						]}
					/>
				)}
				{isFiltered && (
					<Button
						variant='ghost'
						onClick={() => table.resetColumnFilters()}
						className='h-8 px-2 lg:px-3'>
						Reset
						<XIcon className='ml-2 h-4 w-4' />
					</Button>
				)}
			</div>
			<DataTableViewOptions table={table} />
		</div>
	);
}
