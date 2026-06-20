import _ from 'lodash';
import { DateTime } from 'luxon';
import { useState } from 'react';
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
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import A3TableRows from '@/features/schedule-fa/components/a3-table-rows';
import { useTransactionsQuery } from '@/features/schedule-fa/hooks/transactions';
import type { GroupingOption } from '@/features/schedule-fa/lib/calculations';
import type { Transaction } from '@/features/schedule-fa/lib/types';

export default function ScheduleFAOutput() {
	const [year, setYear] = useState(getDefaultYear());
	const [grouping, setGrouping] = useState<GroupingOption>('none');

	const { isLoading: isLoadingTransactions, data: transactions = [] } =
		useTransactionsQuery();

	if (isLoadingTransactions) {
		return null; // Don't show loading state for transactions, as the input table already has one
	}

	const validTransactions = transactions.filter(
		(h) => h.symbol && h.units > 0 && h.date
	);

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				<h2 className='text-lg font-semibold'>Schedule FA — Table A3 Output</h2>
				<div className='flex items-center gap-4'>
					<div className='flex items-center gap-2'>
						<span className='text-sm text-muted-foreground'>
							Reporting Year:
						</span>
						<Select
							value={String(year)}
							onValueChange={(v) => setYear(Number(v))}
						>
							<SelectTrigger className='w-24'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{getYearOptions(validTransactions).map((y) => (
									<SelectItem key={y} value={String(y)}>
										{y}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className='flex items-center gap-2'>
						<span className='text-sm text-muted-foreground'>Group by:</span>
						<Select
							value={grouping}
							onValueChange={(v) => setGrouping(v as GroupingOption)}
						>
							<SelectTrigger className='w-48'>
								<SelectValue placeholder='Select grouping'>
									{displayGrouping(grouping)}
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='none'>{displayGrouping('none')}</SelectItem>
								<SelectItem value='by-stock'>
									{displayGrouping('by-stock')}
								</SelectItem>
								<SelectItem value='by-year'>
									{displayGrouping('by-year')}
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			<div className='border rounded-lg max-h-96 overflow-auto'>
				<Table>
					<TableHeader className='sticky top-0 z-10 bg-background shadow-[inset_0_-1px_0_0_var(--color-border)]'>
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
						<A3TableRows
							transactions={validTransactions}
							year={year}
							grouping={grouping}
						/>
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

function getDefaultYear(): number {
	return DateTime.now().year - 1;
}

function getYearOptions(transactions: Transaction[]): number[] {
	const currentYear = DateTime.now().year;
	const minYearFromTransactions = _.minBy(transactions, 'date')?.date;

	const years: number[] = [];
	for (
		let y = currentYear;
		y >=
		(minYearFromTransactions
			? DateTime.fromISO(minYearFromTransactions).year
			: currentYear);
		y--
	) {
		years.push(y);
	}
	return years;
}

function displayGrouping(option: GroupingOption): string {
	switch (option) {
		case 'none':
			return 'No Grouping';
		case 'by-stock':
			return 'By Stock';
		case 'by-year':
			return 'By Acquisition Year';
	}
}
