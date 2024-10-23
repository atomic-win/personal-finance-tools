import { Transaction } from '@/features/investments/lib/types';
import { Button } from '@/components/ui/button';
import { createColumnDef, DataTable } from '@/components/ui/data-table';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import {
	displayTransactionAmount,
	displayTransactionType,
} from '@/features/investments/lib/utils';
import { Currency } from '@/lib/types';

type TransactionTableItem = Transaction & {
	currency: Currency;
};

const columns: ColumnDef<TransactionTableItem>[] = [
	createColumnDef({
		accessorKey: 'date',
		headerText: 'Date',
		cellTextFn: (item) => item.date,
		align: 'left',
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'transactionName',
		id: 'Transaction Name',
		headerText: 'Transaction Name',
		cellTextFn: (item) => item.name,
		align: 'left',
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'transactionType',
		id: 'Transaction Type',
		headerText: 'Transaction Type',
		cellTextFn: (item) => displayTransactionType(item.type),
		align: 'left',
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'units',
		headerText: 'Units',
		cellTextFn: (item) => item.units.toString(),
		align: 'right',
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'transactionAmount',
		headerText: 'Transaction Amount',
		cellTextFn: (item) => displayTransactionAmount(item.currency, item.amount),
		align: 'right',
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

export default function TransactionsTable({
	currency,
	transactions,
}: {
	currency: Currency;
	transactions: Transaction[];
}) {
	const transactionTableItems = transactions.map((transaction) => ({
		...transaction,
		currency,
	}));

	return (
		<div className='mx-auto'>
			<div className='flex justify-start text-xl font-semibold'>
				Transactions
			</div>
			<DataTable
				columns={columns}
				data={transactionTableItems}
				initialSorting={[
					{
						id: 'date',
						desc: true,
					},
				]}
				doPagination={true}
			/>
		</div>
	);
}
