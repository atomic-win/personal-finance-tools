import SidebarTriggerWithBreadcrumb from '@/components/sidebar-trigger-with-breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CSVUploadButton from '@/features/schedule-fa/components/CSVUploadDialog';
import TransactionsInputTable from '@/features/schedule-fa/components/TransactionsInputTable';
import ScheduleFAOutput from '@/features/schedule-fa/components/ScheduleFAOutput';
import {
	useClearTransactionsMutation,
	useTransactionsQuery,
} from '@/features/schedule-fa/hooks/transactions';


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
								<CSVUploadButton />
								{transactions.length > 0 && (
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
						<TransactionsInputTable />
					</CardContent>
				</Card>

				<ScheduleFAOutput />
			</div>
		</>
	);
}
