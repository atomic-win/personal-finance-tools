'use client';
import MutualFunds from '@/features/analyzers/components/MutualFunds';
import { Suspense } from 'react';

export default function Page() {
	return (
		<div className='container mx-auto p-2'>
			<h1 className='text-2xl font-bold'>Mutual Funds</h1>
			<h2 className='text-lg font-semibold'>Rolling Returns Analysis</h2>
			<p className='mb-4'>
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
	);
}
