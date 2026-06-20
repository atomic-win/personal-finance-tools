import { PlusIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
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
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import {
	useAddTransactionMutation,
	useRemoveTransactionMutation,
	useTransactionsQuery,
	useUpdateTransactionMutation,
} from '@/features/schedule-fa/hooks/transactions';

const emptyDraft = {
	date: '',
	remarks: '',
	symbol: '',
	type: 'Buy' as const,
	units: 0,
	price: 0,
};

export default function TransactionsInputTable() {
	const { isLoading: isLoadingTransactions, data: transactions = [] } =
		useTransactionsQuery();
	const { mutate: addTransaction } = useAddTransactionMutation();
	const { mutate: updateTransaction } = useUpdateTransactionMutation();
	const { mutate: removeTransaction } = useRemoveTransactionMutation();
	const [draft, setDraft] = useState({ ...emptyDraft });

	if (isLoadingTransactions) {
		return <LoadingComponent loadingMessage='Loading transactions...' />;
	}

	const canAdd = draft.symbol && draft.date && draft.units > 0;

	const handleAdd = () => {
		if (!canAdd) return;
		addTransaction(draft);
		setDraft({ ...emptyDraft });
	};

	return (
		<div className='space-y-2'>
			<div className='border rounded-lg max-h-96 overflow-auto'>
				<table className='w-full caption-bottom text-sm'>
					<thead className='sticky top-0 z-10 bg-background shadow-[inset_0_-1px_0_0_var(--color-border)]'>
						<tr>
							<th className='h-10 px-2 text-left align-middle font-medium whitespace-nowrap w-40'>
								Date
							</th>
							<th className='h-10 px-2 text-left align-middle font-medium whitespace-nowrap'>
								Remarks
							</th>
							<th className='h-10 px-2 text-left align-middle font-medium whitespace-nowrap w-28'>
								Symbol
							</th>
							<th className='h-10 px-2 text-left align-middle font-medium whitespace-nowrap w-24'>
								Type
							</th>
							<th className='h-10 px-2 text-left align-middle font-medium whitespace-nowrap w-24'>
								Units
							</th>
							<th className='h-10 px-2 text-left align-middle font-medium whitespace-nowrap w-32'>
								Price
							</th>
							<th className='h-10 px-2 text-left align-middle font-medium whitespace-nowrap w-10' />
						</tr>
					</thead>
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
				</table>
			</div>
			{/* Inline add row — pr compensates for scrollbar width in main table */}
			<div className='pr-2'>
			<table className='w-full text-sm'>
				<tbody>
					<tr>
						<td className='p-2 w-40'>
							<Input
								type='date'
								value={draft.date}
								onChange={(e) => setDraft({ ...draft, date: e.target.value })}
								className='w-36'
							/>
						</td>
						<td className='p-2'>
							<Input
								value={draft.remarks}
								onChange={(e) => setDraft({ ...draft, remarks: e.target.value })}
								placeholder='Remarks'
								className='w-full min-w-20'
							/>
						</td>
						<td className='p-2 w-28'>
							<Input
								value={draft.symbol}
								onChange={(e) => setDraft({ ...draft, symbol: e.target.value })}
								placeholder='AAPL'
								className='w-24'
							/>
						</td>
						<td className='p-2 w-24'>
							<Select
								value={draft.type}
								onValueChange={(v) =>
									setDraft({ ...draft, type: v as 'Buy' | 'Sell' })
								}
							>
								<SelectTrigger className='w-20'>
									<SelectValue>{draft.type}</SelectValue>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='Buy'>Buy</SelectItem>
									<SelectItem value='Sell'>Sell</SelectItem>
								</SelectContent>
							</Select>
						</td>
						<td className='p-2 w-24'>
							<Input
								type='number'
								value={draft.units || ''}
								onChange={(e) => setDraft({ ...draft, units: Number(e.target.value) })}
								placeholder='Units'
								className='w-20'
								min={0}
							/>
						</td>
						<td className='p-2 w-32'>
							<Input
								type='number'
								value={draft.price || ''}
								onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
								placeholder='Price'
								className='w-28'
								min={0}
								step='0.01'
							/>
						</td>
						<td className='p-2 w-10'>
							<Button
								size='icon-sm'
								onClick={handleAdd}
								disabled={!canAdd}
							>
								<PlusIcon className='size-4' />
							</Button>
						</td>
					</tr>
				</tbody>
			</table>
			</div>
		</div>
	);
}
