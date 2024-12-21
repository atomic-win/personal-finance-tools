'use client';
import { useState } from 'react';
import SIPCalculatorCard from '@/features/calculators/components/SIPCalculatorCard';
import { Button } from '@/components/ui/button';
import { v7 } from 'uuid';
import { PlusIcon } from 'lucide-react';

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
				A Systematic Investment Plan (SIP) is a facility provided by mutual
				funds that allows investors to invest a fixed amount in a mutual fund
				scheme at regular intervals. SIP is a popular option for investors who
				want to invest in mutual funds without worrying about market timing.
				With our SIP calculator, you can estimate the future value of your
				investment based on your investment amount, tenure, and expected
				returns.
			</p>
			<div className='flex justify-end'>
				<Button onClick={addCalculator}>
					<PlusIcon />
					Add Calculator
				</Button>
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
