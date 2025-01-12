'use client';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import MutualFunds from '@/features/analyzers/components/MutualFunds';
import { Suspense } from 'react';

export default function Page() {
	return (
		<>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{ title: 'Mutual Funds Analysis', href: '', disabled: true },
					{
						title: 'Rolling Returns',
						href: '/mutual-funds-analysis/rolling-returns',
					},
				]}
			/>
			<div className='px-4 space-y-2'>
				<h1 className='text-2xl font-bold'>Mutual Funds Analysis</h1>
				<h2 className='text-lg font-semibold'>Rolling Returns</h2>
				<p>
					Analyze CAGR (Compound Annual Growth Rate) rolling returns of Indian
					Mutual Funds. Understand long-term fund performance across different
					time frames to make informed investment decisions. Discover trends,
					evaluate consistency, and compare funds to identify those that align
					with your financial goals.
				</p>
				<Suspense>
					<MutualFunds />
				</Suspense>
			</div>
		</>
	);
}
