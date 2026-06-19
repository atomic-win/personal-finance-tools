import { PlusIcon, Trash2Icon } from 'lucide-react';
import LoadingComponent from '@/components/loading-component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	TableBody,
	TableCell,
	TableRow,
} from '@/components/ui/table';
import {
	useAddTransactionMutation,
	useRemoveTransactionMutation,
	useTransactionsQuery,
	useUpdateTransactionMutation,
} from '@/features/schedule-fa/hooks/transactions';

export default function TransactionsInputTable() {
	const { isLoading: isLoadingTransactions, data: transactions = [] } =
		useTransactionsQuery();
	const { mutate: addTransaction } = useAddTransactionMutation();
	const { mutate: updateTransaction } = useUpdateTransactionMutation();
	const { mutate: removeTransaction } = useRemoveTransactionMutation();

	if (isLoadingTransactions) {
		return <LoadingComponent loadingMessage='Loading transactions...' />;
	}

	return (
		<div>
			<div className='border rounded-lg max-h-96 overflow-auto'>
				<table className='w-full caption-bottom text-sm'>
					<thead className='sticky top-0 z-10 bg-background shadow-[inset_0_-1px_0_0_var(--color-border)]'>
						<tr>
							<th className='h-10 px-2 text-left align-middle font-medium whitespace-nowrap w-24'>Type</th>
							<th className='h-10 px-2 text-left align-middle font-medium whitespace-nowrap w-28'>Symbol</th>
							<th className='h-10 px-2 text-left align-middle font-medium whitespace-nowrap w-40'>Date</th>
							<th className='h-10 px-2 text-left align-middle font-medium whitespace-nowrap w-24'>Units</th>
							<th className='h-10 px-2 text-left align-middle font-medium whitespace-nowrap w-32'>Price</th>
							<th className='h-10 px-2 text-left align-middle font-medium whitespace-nowrap w-10' />
						</tr>
					</thead>
					<TableBody>
						{transactions.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={6}
									className='text-center text-muted-foreground'
								>
									No transactions added. Add manually or upload a file.
								</TableCell>
							</TableRow>
						)}
						{transactions.map((tx) => (
							<TableRow key={tx.id}>
								<TableCell>
									<Select
										value={tx.type}
										onValueChange={(v) =>
											updateTransaction({ ...tx, type: v as 'Buy' | 'Sell' })
										}
									>
										<SelectTrigger className='w-20'>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='Buy'>Buy</SelectItem>
											<SelectItem value='Sell'>Sell</SelectItem>
										</SelectContent>
									</Select>
								</TableCell>
								<TableCell>
									<Input
										value={tx.symbol}
										onChange={(e) =>
											updateTransaction({ ...tx, symbol: e.target.value })
										}
										placeholder='AAPL'
										className='w-24'
									/>
								</TableCell>
								<TableCell>
									<Input
										type='date'
										value={tx.date}
										onChange={(e) =>
											updateTransaction({ ...tx, date: e.target.value })
										}
										className='w-36'
									/>
								</TableCell>
								<TableCell>
									<Input
										type='number'
										value={tx.units || ''}
										onChange={(e) =>
											updateTransaction({
												...tx,
												units: Number(e.target.value),
											})
										}
										placeholder='10'
										className='w-20'
										min={0}
									/>
								</TableCell>
								<TableCell>
									<Input
										type='number'
										value={tx.price || ''}
										onChange={(e) =>
											updateTransaction({
												...tx,
												price: Number(e.target.value),
											})
										}
										placeholder='172.50'
										className='w-28'
										min={0}
										step='0.01'
									/>
								</TableCell>
								<TableCell>
									<Button
										variant='ghost'
										size='icon-sm'
										onClick={() => removeTransaction(tx.id)}
									>
										<Trash2Icon className='size-4' />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</table>
			</div>
			<div className='flex justify-end mt-2'>
				<Button size='sm' onClick={() => addTransaction()}>
					<PlusIcon className='size-4' />
					Add Row
				</Button>
			</div>
		</div>
	);
}
