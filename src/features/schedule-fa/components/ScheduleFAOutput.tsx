import { useState } from 'react';
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
import { groupRows } from '@/features/schedule-fa/lib/schedule-fa-compute';
import type {
	GroupingOption,
	ScheduleFARow,
} from '@/features/schedule-fa/lib/types';

type Props = {
	rows: ScheduleFARow[];
};

function formatAmount(value: number): string {
	return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

export default function ScheduleFAOutput({ rows }: Props) {
	const [grouping, setGrouping] = useState<GroupingOption>('none');
	const displayRows = groupRows(rows, grouping);

	if (rows.length === 0) return null;

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				<h2 className='text-lg font-semibold'>Schedule FA — Table A3 Output</h2>
				<div className='flex items-center gap-2'>
					<span className='text-sm text-muted-foreground'>Group by:</span>
					<Select
						value={grouping}
						onValueChange={(v) => setGrouping(v as GroupingOption)}
					>
						<SelectTrigger className='w-48'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='none'>No Grouping</SelectItem>
							<SelectItem value='by-stock'>By Stock</SelectItem>
							<SelectItem value='by-year'>By Acquisition Year</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<ScrollArea className='border rounded-lg'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='text-center'>Sl. No</TableHead>
							<TableHead>Country Name & Code</TableHead>
							<TableHead>Name of Entity</TableHead>
							<TableHead>Address of Entity</TableHead>
							<TableHead>Zip Code</TableHead>
							<TableHead>Nature of Entity</TableHead>
							<TableHead>Date of Acquiring</TableHead>
							<TableHead className='text-right'>Initial Value</TableHead>
							<TableHead className='text-right'>Peak Value</TableHead>
							<TableHead className='text-right'>Closing Balance</TableHead>
							<TableHead className='text-right'>Dividends</TableHead>
							<TableHead className='text-right'>Sale Proceeds</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{displayRows.map((row) => (
							<TableRow key={row.slNo}>
								<TableCell className='text-center'>{row.slNo}</TableCell>
								<TableCell>{row.countryNameAndCode}</TableCell>
								<TableCell>{row.nameOfEntity}</TableCell>
								<TableCell>{row.addressOfEntity}</TableCell>
								<TableCell>{row.zipCode || '—'}</TableCell>
								<TableCell>{row.natureOfEntity}</TableCell>
								<TableCell>{row.dateOfAcquiring}</TableCell>
								<TableCell className='text-right'>
									{formatAmount(row.initialValueINR)}
								</TableCell>
								<TableCell className='text-right'>
									{formatAmount(row.peakValueINR)}
								</TableCell>
								<TableCell className='text-right'>
									{formatAmount(row.closingBalanceINR)}
								</TableCell>
								<TableCell className='text-right'>
									{formatAmount(row.totalDividendsINR)}
								</TableCell>
								<TableCell className='text-right'>
									{formatAmount(row.totalSaleProceedsINR)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</ScrollArea>
		</div>
	);
}
