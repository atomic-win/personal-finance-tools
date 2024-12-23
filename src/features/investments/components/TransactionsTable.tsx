import { AssetPortfolio, Transaction } from '@/features/investments/lib/types';
import { createColumnDef, DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import {
	displayTransactionAmount,
	displayTransactionType,
} from '@/features/investments/lib/utils';
import DeleteTransactionDialog from '@/features/investments/components/DeleteTransactionDialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Currency } from '@/lib/types';
import { PlusIcon } from 'lucide-react';

type TableItem = Transaction & {
	asset: AssetPortfolio;
	currency: Currency;
};

const columns: ColumnDef<TableItem>[] = [
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
		cell: ({ row }) => {
			const item = row.original;
			return (
				<DeleteTransactionDialog
					asset={item.asset}
					transaction={item}
					currency={item.currency}
				/>
			);
		},
	},
];

export default function TransactionsTable({
	asset,
	transactions,
	currency,
}: {
	asset: AssetPortfolio;
	transactions: Transaction[];
	currency: Currency;
}) {
	const items = transactions.map((transaction) => ({
		...transaction,
		asset,
		currency,
	}));

	return (
		<div className='mx-auto'>
			<div className='flex justify-end text-xl font-semibold items-center'>
				<Button>
					<PlusIcon />
					<Link href={`/investments/assets/${asset.id}/transactions/add`}>
						Add Transaction
					</Link>
				</Button>
			</div>
			<DataTable
				columns={columns}
				data={items}
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
