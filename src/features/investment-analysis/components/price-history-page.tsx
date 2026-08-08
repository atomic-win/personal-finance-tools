import { useState } from 'react';
import SidebarTriggerWithBreadcrumb from '@/components/sidebar-trigger-with-breadcrumb';
import PriceHistoryCard from '@/features/investment-analysis/components/price-history-card';
import SelectIndexesCard from '@/features/investment-analysis/components/select-indexes-card';
import SelectMutualFundsCard from '@/features/investment-analysis/components/select-mutual-funds-card';
import { PresetTimeDurations } from '@/features/investment-analysis/lib/types';

export default function PriceHistoryPage() {
	return (
		<>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{
						title: 'Investment Analysis',
						href: '',
						disabled: true,
					},
					{
						title: 'Price History',
						href: '/investment-analysis/price-history',
						disabled: true,
					},
				]}
			/>
			<div className='px-4 space-y-2'>
				<h1 className='text-2xl font-bold'>Investment Analysis</h1>
				<h2 className='text-lg font-semibold'>Price History</h2>
				<p>
					View the historical Net Asset Value (NAV) of Indian Mutual Funds and
					the historical levels of global stock market indexes. Compare trends
					across multiple investments, in your preferred currency, to track
					performance over time.
				</p>
				<PriceHistoryPageContainer />
			</div>
		</>
	);
}

function PriceHistoryPageContainer() {
	const [timeRange, setTimeRange] = useState(PresetTimeDurations.OneYear);

	return (
		<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
			<div className='order-2 md:order-1 md:col-span-2 space-y-4'>
				<PriceHistoryCard
					timeRange={timeRange}
					onTimeRangeChange={setTimeRange}
				/>
			</div>
			<div className='order-1 md:order-2 space-y-4'>
				<SelectMutualFundsCard />
				<SelectIndexesCard />
			</div>
		</div>
	);
}
