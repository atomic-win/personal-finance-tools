'use client';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import ReturnsPageContainer from '@/features/indian-mutual-funds-analysis/components/ReturnsPageContainer';
import { Suspense } from 'react';

export default function Page() {
	return (
		<>
			<title>Mutual Funds Rolling Returns</title>
			<meta
				name='keywords'
				content='Mutual Funds, Rolling Returns, CAGR, Investment Analysis, Financial Planning'
			/>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{ title: 'Indian Mutual Funds Analysis', href: '', disabled: true },
					{
						title: 'Rolling Returns',
						href: '/indian-mutual-funds-analysis/rolling-returns',
					},
				]}
			/>
			<div className='px-4 space-y-2'>
				<h1 className='text-2xl font-bold'>Indian Mutual Funds Analysis</h1>
				<h2 className='text-lg font-semibold'>Rolling Returns</h2>
				<p>
					Analyze CAGR (Compound Annual Growth Rate) rolling returns of Indian
					Mutual Funds. Understand long-term fund performance across different
					time frames to make informed investment decisions. Discover trends,
					evaluate consistency, and compare funds to identify those that align
					with your financial goals.
				</p>
				<Suspense>
					<ReturnsPageContainer returnType='simple' />
				</Suspense>
			</div>
		</>
	);
}
