import { Trash2Icon } from 'lucide-react';
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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import AddTransactionRow from '@/features/schedule-fa-a3/components/add-input-row';
import {
	useRemoveTransactionMutation,
	useTransactionsQuery,
	useUpdateTransactionMutation,
} from '@/features/schedule-fa-a3/hooks/transactions';

export default function TransactionsInputTable() {
	const { isLoading: isLoadingTransactions, data: transactions = [] } =
		useTransactionsQuery();
	const { mutate: updateTransaction } = useUpdateTransactionMutation();
	const { mutate: removeTransaction } = useRemoveTransactionMutation();

	if (isLoadingTransactions) {
		return <LoadingComponent loadingMessage='Loading transactions...' />;
	}

	return (
		<div className='space-y-2'>
			<div className='border rounded-lg max-h-96 overflow-auto'>
				<Table>
					<TableHeader className='sticky top-0 z-10 bg-background shadow-[inset_0_-1px_0_0_var(--color-border)]'>
						<TableRow>
							<TableHead className='w-40'>Date</TableHead>
							<TableHead>Remarks</TableHead>
							<TableHead className='w-28'>Symbol</TableHead>
							<TableHead className='w-24'>Type</TableHead>
							<TableHead className='w-24'>Units</TableHead>
							<TableHead className='w-32'>Price</TableHead>
							<TableHead className='w-10' />
						</TableRow>
					</TableHeader>
					<TableBody>
						{transactions.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={7}
									className='text-center text-muted-foreground'
								>
									No transactions yet.
								</TableCell>
							</TableRow>
						)}
						{transactions.map((tx) => (
							<TableRow key={tx.id}>
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
										value={tx.remarks}
										onChange={(e) =>
											updateTransaction({ ...tx, remarks: e.target.value })
										}
										className='w-full min-w-20'
									/>
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
									<Select
										value={tx.type}
										onValueChange={(v) =>
											updateTransaction({ ...tx, type: v as 'Buy' | 'Sell' })
										}
									>
										<SelectTrigger className='w-20'>
											<SelectValue>{tx.type}</SelectValue>
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='Buy'>Buy</SelectItem>
											<SelectItem value='Sell'>Sell</SelectItem>
										</SelectContent>
									</Select>
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
										variant='destructive'
										size='icon-sm'
										onClick={() => removeTransaction(tx.id)}
									>
										<Trash2Icon className='size-4' />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<AddTransactionRow />
		</div>
	);
}
