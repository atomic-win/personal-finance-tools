import { AssetPortfolio, Transaction } from '@/features/investments/lib/types';
import { createColumnDef, DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import {
	displayTransactionAmount,
	displayTransactionType,
} from '@/features/investments/lib/utils';
import DeleteTransactionDialog from '@/features/investments/components/DeleteTransactionDialog';

type TransactionTableItem = Transaction & {
	asset: AssetPortfolio;
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
		cellTextFn: (item) =>
			displayTransactionAmount(item.asset.currency, item.amount),
		align: 'right',
		enableHiding: false,
	}),
	{
		id: 'actions',
		cell: ({ row }) => {
			const item = row.original;
			return <DeleteTransactionDialog asset={item.asset} transaction={item} />;
		},
	},
];

export default function TransactionsTable({
	asset,
	transactions,
}: {
	asset: AssetPortfolio;
	transactions: Transaction[];
}) {
	const transactionTableItems = transactions.map((transaction) => ({
		...transaction,
		asset,
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
