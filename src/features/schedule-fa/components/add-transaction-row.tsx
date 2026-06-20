import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useAddTransactionMutation } from '@/features/schedule-fa/hooks/transactions';
import type { Transaction } from '@/features/schedule-fa/lib/types';

export default function AddTransactionRow() {
	const { mutate: addTransaction } = useAddTransactionMutation();
	const [draft, setDraft] = useState({
		date: '',
		remarks: '',
		symbol: '',
		type: 'Buy' as const,
		units: 0,
		price: 0,
	} as Omit<Transaction, 'id'>);

	const canAdd = draft.symbol && draft.date && draft.units > 0;

	const handleAdd = () => {
		if (!canAdd) return;
		addTransaction(draft);
		setDraft({
			date: '',
			remarks: '',
			symbol: '',
			type: 'Buy',
			units: 0,
			price: 0,
		});
	};

	return (
		<div className='pr-4'>
			<Table>
				<TableBody>
					<TableRow className='border-0'>
						<TableCell className='w-40'>
							<Input
								type='date'
								value={draft.date}
								onChange={(e) => setDraft({ ...draft, date: e.target.value })}
								className='w-36'
							/>
						</TableCell>
						<TableCell>
							<Input
								value={draft.remarks}
								onChange={(e) =>
									setDraft({ ...draft, remarks: e.target.value })
								}
								placeholder='Remarks'
								className='w-full min-w-20'
							/>
						</TableCell>
						<TableCell className='w-28'>
							<Input
								value={draft.symbol}
								onChange={(e) => setDraft({ ...draft, symbol: e.target.value })}
								placeholder='AAPL'
								className='w-24'
							/>
						</TableCell>
						<TableCell className='w-24'>
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
						</TableCell>
						<TableCell className='w-24'>
							<Input
								type='number'
								value={draft.units || ''}
								onChange={(e) =>
									setDraft({ ...draft, units: Number(e.target.value) })
								}
								placeholder='Units'
								className='w-20'
								min={0}
							/>
						</TableCell>
						<TableCell className='w-32'>
							<Input
								type='number'
								value={draft.price || ''}
								onChange={(e) =>
									setDraft({ ...draft, price: Number(e.target.value) })
								}
								placeholder='Price'
								className='w-28'
								min={0}
								step='0.01'
							/>
						</TableCell>
						<TableCell className='w-10'>
							<Button size='icon-sm' onClick={handleAdd} disabled={!canAdd}>
								<PlusIcon className='size-4' />
							</Button>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	);
}
