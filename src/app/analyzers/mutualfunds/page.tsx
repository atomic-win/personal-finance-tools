'use client';
import MutualFunds from '@/features/analyzers/components/MutualFunds';
import { Suspense } from 'react';

export default function Page() {
	return (
		<div className='container mx-auto p-2'>
			<h1 className='text-2xl font-bold mb-4'>Mutual Funds Analyzer</h1>
			<Suspense>
				<MutualFunds />
			</Suspense>
		</div>
	);
}
