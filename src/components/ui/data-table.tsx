'use client';

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
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
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, ArrowUpDown, ExternalLink } from 'lucide-react';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { cn } from '@/lib/utils';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import Link from 'next/link';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function createColumnDef<TData>({
	accessorKey,
	id,
	headerText,
	linkFn,
	cellTextFn,
	sortingFnCompare,
	align = 'right',
	enableHiding = true,
}: {
	accessorKey: (string & {}) | keyof TData;
	id?: string;
	headerText: string;
	linkFn?: (data: TData) => string;
	cellTextFn: (data: TData) => React.ReactNode;
	sortingFnCompare?: (data: TData) => string | number;
	align?: 'left' | 'right';
	enableHiding?: boolean;
}): ColumnDef<TData> {
	return {
		accessorKey,
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
					{linkFn ? (
						<Link
							href={linkFn(row.original)}
							target='_blank'
							className='underline'>
							<div className='flex items-center'>
								{cellTextFn(row.original)}
								<ExternalLink className='h-4 w-4 ml-1' />
							</div>
						</Link>
					) : (
						cellTextFn(row.original)
					)}
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
	doPagination = false,
}: DataTableProps<TData, TValue> & {
	initialSorting?: SortingState;
	initialColumnVisibility?: VisibilityState;
	doPagination?: boolean;
}) {
	const [sorting, setSorting] = useState<SortingState>(initialSorting || []);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		initialColumnVisibility || {}
	);

	if (data.length === 1) {
		doPagination = false;
	}

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: doPagination ? 8 : data.length,
	});

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		onColumnVisibilityChange: setColumnVisibility,
		getPaginationRowModel: getPaginationRowModel(),
		onPaginationChange: setPagination,
		state: {
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

			{doPagination && <DataTablePagination table={table} />}
		</div>
	);
}
