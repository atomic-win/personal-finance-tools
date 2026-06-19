import { DateTime } from 'luxon';
import { useState } from 'react';
import SidebarTriggerWithBreadcrumb from '@/components/sidebar-trigger-with-breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import CSVUploadDialog from '@/features/schedule-fa/components/CSVUploadDialog';
import HoldingsInputTable from '@/features/schedule-fa/components/HoldingsInputTable';
import ScheduleFAOutput from '@/features/schedule-fa/components/ScheduleFAOutput';
import {
	useClearTransactionsMutation,
	useTransactionsQuery,
} from '@/features/schedule-fa/hooks/useHoldings';

function getDefaultYear(): number {
	return DateTime.now().year - 1;
}

function getYearOptions(): number[] {
	const currentYear = DateTime.now().year;
	const years: number[] = [];
	for (let y = currentYear; y >= 2015; y--) {
		years.push(y);
	}
	return years;
}

export default function ScheduleFAPage() {
	const [year, setYear] = useState(getDefaultYear());
	const { data: holdings = [] } = useTransactionsQuery();
	const { mutate: clearTransactions } = useClearTransactionsMutation();

	return (
		<>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{ title: 'ITR Tools', href: '', disabled: true },
					{ title: 'Schedule FA — A3', href: '/itr/schedule-fa/a3' },
				]}
			/>
			<div className='px-4 pb-8 space-y-6'>
				<div>
					<h1 className='text-2xl font-bold'>Schedule FA — Table A3</h1>
					<p className='text-muted-foreground'>
						Generate the Foreign Equity & Debt Interest (Direct Holdings)
						section for your ITR filing. Reporting period follows the calendar
						year (Jan 1 – Dec 31).
					</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className='flex items-center justify-between'>
							<span>Holdings</span>
							<div className='flex items-center gap-3'>
								<div className='flex items-center gap-2'>
									<span className='text-sm font-normal text-muted-foreground'>
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
											{getYearOptions().map((y) => (
												<SelectItem key={y} value={String(y)}>
													{y}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<CSVUploadDialog />
								{holdings.length > 0 && (
									<Button
										variant='destructive'
										size='sm'
										onClick={() => clearTransactions()}
									>
										Clear All
									</Button>
								)}
							</div>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<HoldingsInputTable />
					</CardContent>
				</Card>

				<ScheduleFAOutput year={year} />
			</div>
		</>
	);
}
