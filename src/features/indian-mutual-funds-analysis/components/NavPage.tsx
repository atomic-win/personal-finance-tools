'use client';
import { Suspense, useState } from 'react';
import SidebarTriggerWithBreadcrumb from '@/components/sidebar-trigger-with-breadcrumb';
import NavChartCard from '@/features/indian-mutual-funds-analysis/components/NavCard';
import SelectMutualFundsCard from '@/features/indian-mutual-funds-analysis/components/SelectMutualFundsCard';
import { PresetTimeDurations } from '@/features/indian-mutual-funds-analysis/lib/types';

export default function NavChartPage() {
	return (
		<>
			<title>Indian Mutual Funds NAV History</title>
			<meta
				name='keywords'
				content='Mutual Funds, NAV, Net Asset Value, NAV History, Investment Analysis'
			/>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{
						title: 'Indian Mutual Funds Analysis',
						href: '',
						disabled: true,
					},
					{
						title: 'NAV History',
						href: '/indian-mutual-funds-analysis/nav',
						disabled: true,
					},
				]}
			/>
			<div className='px-4 space-y-2'>
				<h1 className='text-2xl font-bold'>Indian Mutual Funds Analysis</h1>
				<h2 className='text-lg font-semibold'>NAV History</h2>
				<p>
					View the historical Net Asset Value (NAV) of Indian Mutual Funds.
					Compare NAV trends across multiple funds to track performance over
					time.
				</p>
				<Suspense>
					<NavChartPageContainer />
				</Suspense>
			</div>
		</>
	);
}

function NavChartPageContainer() {
	const [timeRange, setTimeRange] = useState(PresetTimeDurations.OneYear);

	return (
		<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
			<div className='order-2 md:order-1 md:col-span-2 space-y-4'>
				<NavChartCard timeRange={timeRange} onTimeRangeChange={setTimeRange} />
			</div>
			<div className='order-1 md:order-2'>
				<SelectMutualFundsCard />
			</div>
		</div>
	);
}
