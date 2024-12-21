'use client';
import { useState } from 'react';
import SIPCalculatorCard from '@/features/calculators/components/SIPCalculatorCard';
import { Button } from '@/components/ui/button';
import { v7 } from 'uuid';

export default function SIPPage() {
	const [calculators, setCalculators] = useState([v7()]);

	const addCalculator = () => {
		setCalculators([...calculators, v7()]);
	};

	const removeCalculator = (id: string) => {
		setCalculators(calculators.filter((calculator) => calculator !== id));
	};

	return (
		<div className='container mx-auto p-2'>
			<h1 className='text-2xl font-bold mb-4'>SIP Calculator</h1>
			<p>
				A Systematic Investment Plan (SIP) is a disciplined and convenient way
				to invest in mutual funds. With SIP, you can invest a fixed amount at
				regular intervals, allowing you to benefit from rupee cost averaging and
				the power of compounding. Use our SIP calculator to estimate your future
				wealth based on your investment amount, tenure, and expected returns,
				and plan your financial goals effectively.
			</p>
			<div className='flex justify-end mb-4'>
				<Button onClick={addCalculator}>Add Calculator</Button>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{calculators.map((id, index) => (
					<SIPCalculatorCard
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
