'use client';

import {
	AccessorFn,
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState,
} from '@tanstack/react-table';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { cn } from '@/lib/utils';
import { DataTablePagination } from '@/components/ui/data-table-pagination';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function createColumnDef<TData>({
	accessorKey,
	accessorFn,
	id,
	headerText,
	cellTextFn,
	sortingFnCompare,
	align = 'right',
	enableHiding = true,
}: {
	accessorKey: (string & {}) | keyof TData;
	accessorFn?: AccessorFn<TData>;
	id?: string;
	headerText: string;
	cellTextFn: (data: TData) => string;
	sortingFnCompare?: (data: TData) => string | number;
	align?: 'left' | 'right';
	enableHiding?: boolean;
}): ColumnDef<TData> {
	return {
		accessorKey,
		accessorFn,
		id,
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						sortingFnCompare &&
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className={cn(
						'p-0 w-full',
						align === 'left' && 'justify-start',
						align === 'right' && 'justify-end'
					)}>
					{headerText}
					{sortingFnCompare && (
						<>
							{column.getIsSorted() === 'asc' && (
								<ArrowDown className='h-4 w-4' />
							)}
							{column.getIsSorted() === 'desc' && (
								<ArrowUp className='h-4 w-4' />
							)}
							{column.getIsSorted() === false && (
								<ArrowUpDown className='h-4 w-4' />
							)}
						</>
					)}
				</Button>
			);
		},
		cell: ({ row }) => {
			return (
				<div
					className={cn(
						'font-medium',
						align === 'left' && 'text-left',
						align === 'right' && 'text-right'
					)}>
					{cellTextFn(row.original)}
				</div>
			);
		},
		sortingFn: (a, b) => {
			if (!sortingFnCompare) {
				return 0;
			}
			const aVal = sortingFnCompare(a.original);
			const bVal = sortingFnCompare(b.original);

			if (aVal < bVal) {
				return -1;
			}

			if (aVal > bVal) {
				return 1;
			}

			return 0;
		},
		enableSorting: !!sortingFnCompare,
		enableHiding: enableHiding,
	};
}

export function DataTable<TData, TValue>({
	columns,
	data,
	initialSorting,
	initialColumnVisibility,
}: DataTableProps<TData, TValue> & {
	initialSorting?: SortingState;
	initialColumnVisibility?: VisibilityState;
}) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		initialColumnVisibility || {}
	);
	const [sorting, setSorting] = useState<SortingState>(initialSorting || []);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 8,
	});

	console.log({
		columnFilters,
		columnVisibility,
		sorting,
		pagination,
	});

	const table = useReactTable({
		data,
		columns,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onSortingChange: setSorting,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getFacetedRowModel: getFacetedRowModel(), //if you need a list of values for a column (other faceted row models depend on this one)
		getFilteredRowModel: getFilteredRowModel(), //if you need a list of rows that match the filters
		getFacetedUniqueValues: getFacetedUniqueValues(), //if you need a list of unique values
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: {
			columnFilters,
			sorting,
			columnVisibility,
			pagination,
		},
	});

	return (
		<div className='space-y-2'>
			<DataTableToolbar table={table} />

			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<DataTablePagination table={table} />
		</div>
	);
}
