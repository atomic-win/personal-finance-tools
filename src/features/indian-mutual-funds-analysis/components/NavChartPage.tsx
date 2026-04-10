'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import SidebarTriggerWithBreadcrumb from '@/components/sidebar-trigger-with-breadcrumb';
import NavChartCard from '@/features/indian-mutual-funds-analysis/components/NavChartCard';
import SelectMutualFundsCard from '@/features/indian-mutual-funds-analysis/components/SelectMutualFundsCard';

export default function NavChartPage() {
	return (
		<>
			<title>Indian Mutual Funds NAV Chart</title>
			<meta
				name='keywords'
				content='Mutual Funds, NAV, Net Asset Value, NAV Chart, Investment Analysis'
			/>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{
						title: 'Indian Mutual Funds Analysis',
						href: '',
						disabled: true,
					},
					{
						title: 'NAV Chart',
						href: '/indian-mutual-funds-analysis/nav-chart',
						disabled: true,
					},
				]}
			/>
			<div className='px-4 space-y-2'>
				<h1 className='text-2xl font-bold'>Indian Mutual Funds Analysis</h1>
				<h2 className='text-lg font-semibold'>NAV Chart</h2>
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
	const [timeRange, setTimeRange] = useState<string>('1y');

	return (
		<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
			<div className='order-2 md:order-1 md:col-span-2 space-y-4'>
				<NavChartCard
					timeRange={timeRange as 'all'}
					onTimeRangeChange={setTimeRange}
				/>
			</div>
			<div className='order-1 md:order-2'>
				<SelectMutualFundsCard />
			</div>
		</div>
	);
}
