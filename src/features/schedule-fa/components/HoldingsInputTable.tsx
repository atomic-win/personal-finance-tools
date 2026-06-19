import { PlusIcon, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import {
	useAddTransactionMutation,
	useRemoveTransactionMutation,
	useTransactionsQuery,
	useUpdateTransactionMutation,
} from '@/features/schedule-fa/hooks/useHoldings';
import type { Transaction } from '@/features/schedule-fa/lib/types';

export default function HoldingsInputTable() {
	const { data: holdings = [] } = useTransactionsQuery();
	const { mutate: addTransaction } = useAddTransactionMutation();
	const { mutate: updateTransaction } = useUpdateTransactionMutation();
	const { mutate: removeTransaction } = useRemoveTransactionMutation();

	const updateField = (
		id: string,
		field: keyof Transaction,
		value: string | number
	) => {
		const tx = holdings.find((h) => h.id === id);
		if (tx) {
			updateTransaction({ ...tx, [field]: value });
		}
	};

	return (
		<div className='space-y-2'>
			<div className='border rounded-lg'>
				<Table>
					<TableHeader className='sticky top-0 z-10 bg-background'>
						<TableRow>
							<TableHead>Type</TableHead>
							<TableHead>Symbol</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Units</TableHead>
							<TableHead>Price</TableHead>
							<TableHead className='w-10' />
						</TableRow>
					</TableHeader>
				</Table>
				<ScrollArea className='h-96'>
					<Table>
						<TableBody>
						{holdings.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={6}
									className='text-center text-muted-foreground'
								>
									No transactions added. Add manually or upload a CSV/TSV.
								</TableCell>
							</TableRow>
						)}
						{holdings.map((holding) => (
							<TableRow key={holding.id}>
								<TableCell>
									<Select
										value={holding.type}
										onValueChange={(v) => updateField(holding.id, 'type', v)}
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
										value={holding.symbol}
										onChange={(e) =>
											updateField(
												holding.id,
												'symbol',
												e.target.value.toUpperCase()
											)
										}
										placeholder='AAPL'
										className='w-24'
									/>
								</TableCell>
								<TableCell>
									<Input
										type='date'
										value={holding.date}
										onChange={(e) =>
											updateField(holding.id, 'date', e.target.value)
										}
										className='w-40'
									/>
								</TableCell>
								<TableCell>
									<Input
										type='number'
										value={holding.units || ''}
										onChange={(e) =>
											updateField(
												holding.id,
												'units',
												Number(e.target.value)
											)
										}
										placeholder='10'
										className='w-20'
										min={0}
									/>
								</TableCell>
								<TableCell>
									<Input
										type='number'
										value={holding.price || ''}
										onChange={(e) =>
											updateField(
												holding.id,
												'price',
												Number(e.target.value)
											)
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
										onClick={() => removeTransaction(holding.id)}
									>
										<Trash2Icon className='size-4' />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				</ScrollArea>
			</div>
			<div className='flex justify-end'>
				<Button size='sm' onClick={() => addTransaction()}>
					<PlusIcon className='size-4' />
					Add Row
				</Button>
			</div>
		</div>
	);
}
