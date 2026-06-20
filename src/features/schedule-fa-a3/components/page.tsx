import { DownloadIcon, Trash2Icon } from 'lucide-react';
import SidebarTriggerWithBreadcrumb from '@/components/sidebar-trigger-with-breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TransactionsInputTable from '@/features/schedule-fa-a3/components/input-table';
import ScheduleFAOutput from '@/features/schedule-fa-a3/components/output-table';
import UploadButton from '@/features/schedule-fa-a3/components/upload-button';
import {
	useClearTransactionsMutation,
	useTransactionsQuery,
} from '@/features/schedule-fa-a3/hooks/transactions';
import { downloadTransactions } from '@/features/schedule-fa-a3/lib/download-transactions';

export default function ScheduleFAPage() {
	const { data: transactions = [] } = useTransactionsQuery();
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
							<span>Transactions</span>
							<div className='flex items-center gap-3'>
								<UploadButton />
								{transactions.length > 0 && (
									<>
										<Button
											variant='outline'
											size='sm'
											onClick={() => downloadTransactions(transactions)}
										>
											<DownloadIcon className='size-4' />
											Download
										</Button>
										<Button
											variant='destructive'
											size='sm'
											onClick={() => clearTransactions()}
										>
											<Trash2Icon className='size-4' />
											Clear All
										</Button>
									</>
								)}
							</div>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<TransactionsInputTable />
					</CardContent>
				</Card>

				<ScheduleFAOutput />
			</div>
		</>
	);
}
