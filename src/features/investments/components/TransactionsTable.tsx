import { createColumnDef, DataTable } from '@/components/ui/data-table';
import { AssetPortfolio, Transaction } from '@/features/investments/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import {
	displayTransactionAmount,
	displayTransactionType,
	findPortfolioById,
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
import { Currency } from '@/lib/types';

type TransactionTableItem = {
	transaction: Transaction;
	asset: AssetPortfolio;
	currency: Currency;
};

const columns: ColumnDef<TransactionTableItem>[] = [
	createColumnDef({
		accessorKey: 'date',
		headerText: 'Date',
		cellTextFn: (item) => item.transaction.date,
		align: 'left',
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'transactionName',
		id: 'Transaction Name',
		headerText: 'Transaction Name',
		cellTextFn: (item) => item.transaction.name,
		align: 'left',
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'transactionType',
		accessorFn: (item) => item.transaction.type,
		id: 'Transaction Type',
		headerText: 'Transaction Type',
		cellTextFn: (item) => displayTransactionType(item.transaction.type),
		align: 'left',
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'assetName',
		id: 'Asset Name',
		headerText: 'Asset Name',
		cellTextFn: (item) => item.asset.assetName,
		align: 'left',
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'units',
		headerText: 'Units',
		cellTextFn: (item) => item.transaction.units.toString(),
		align: 'right',
		enableHiding: false,
	}),
	createColumnDef({
		accessorKey: 'transactionAmount',
		headerText: 'Transaction Amount',
		cellTextFn: (item) =>
			displayTransactionAmount(item.currency, item.transaction.amount),
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
	portfolios,
	transactions,
}: {
	currency: Currency;
	portfolios: AssetPortfolio[];
	transactions: Transaction[];
}) {
	const transactionTableItems: TransactionTableItem[] = transactions.map(
		(transaction) => ({
			transaction,
			asset: findPortfolioById(portfolios, transaction.assetId)!,
			currency,
		})
	);

	return (
		<div className='mx-auto'>
			<DataTable
				columns={columns}
				data={transactionTableItems}
				initialSorting={[
					{
						id: 'date',
						desc: true,
					},
				]}
			/>
		</div>
	);
}
