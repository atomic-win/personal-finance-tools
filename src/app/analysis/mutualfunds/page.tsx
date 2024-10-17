'use client';
import SIPInputCard from './sip-card';

export default function SIPPage() {
	return (
		<div className='container mx-auto p-2'>
			<h1 className='text-2xl font-bold mb-4'>Mutual Funds Analysis</h1>
			<div className='grid grid-cols-3 gap-4'>
				<SIPInputCard />
			</div>
		</div>
	);
}
