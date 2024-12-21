'use client';
import { useState } from 'react';
import SIPSWPCalculatorCard from '@/features/calculators/components/SIPSWPCalculatorCard';
import { Button } from '@/components/ui/button';
import { v7 } from 'uuid';

export default function Page() {
	const [calculators, setCalculators] = useState([v7()]);

	const addCalculator = () => {
		setCalculators([...calculators, v7()]);
	};

	const removeCalculator = (id: string) => {
		setCalculators(calculators.filter((calculator) => calculator !== id));
	};

	return (
		<div className='container mx-auto p-2'>
			<h1 className='text-2xl font-bold mb-4'>SIP + SWP Calculator</h1>
			<p>
				The SIP + SWP Calculator helps you plan your investments and
				withdrawals. Systematic Investment Plan (SIP) allows you to invest a
				fixed amount regularly, while Systematic Withdrawal Plan (SWP) enables
				you to withdraw a fixed amount periodically. Use this tool to simulate
				and manage your financial goals effectively.
			</p>
			<div className='flex justify-end'>
				<Button onClick={addCalculator}>Add Calculator</Button>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{calculators.map((id, index) => (
					<SIPSWPCalculatorCard
						key={id}
						id={id}
						index={index}
						canRemove={calculators.length > 1 || index !== 0}
						removeCalculator={removeCalculator}
					/>
				))}
			</div>
		</div>
	);
}
