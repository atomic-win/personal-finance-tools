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
import type { HoldingInput } from '@/features/schedule-fa/lib/types';

type Props = {
	holdings: HoldingInput[];
	onChange: (holdings: HoldingInput[]) => void;
};

export default function HoldingsInputTable({ holdings, onChange }: Props) {
	const updateHolding = (
		id: string,
		field: keyof HoldingInput,
		value: string | number
	) => {
		onChange(holdings.map((h) => (h.id === id ? { ...h, [field]: value } : h)));
	};

	const addRow = () => {
		onChange([
			...holdings,
			{
				id: crypto.randomUUID(),
				symbol: '',
				quantity: 0,
				purchaseDate: '',
				purchasePrice: 0,
				type: 'Buy',
			},
		]);
	};

	const removeRow = (id: string) => {
		onChange(holdings.filter((h) => h.id !== id));
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
							<TableHead>Price (USD)</TableHead>
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
										onValueChange={(v) => updateHolding(holding.id, 'type', v)}
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
											updateHolding(
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
										value={holding.purchaseDate}
										onChange={(e) =>
											updateHolding(holding.id, 'purchaseDate', e.target.value)
										}
										className='w-40'
									/>
								</TableCell>
								<TableCell>
									<Input
										type='number'
										value={holding.quantity || ''}
										onChange={(e) =>
											updateHolding(
												holding.id,
												'quantity',
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
										value={holding.purchasePrice || ''}
										onChange={(e) =>
											updateHolding(
												holding.id,
												'purchasePrice',
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
										onClick={() => removeRow(holding.id)}
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
			<Button variant='outline' size='sm' onClick={addRow}>
				<PlusIcon className='size-4' />
				Add Row
			</Button>
		</div>
	);
}
