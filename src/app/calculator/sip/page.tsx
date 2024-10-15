'use client';
import { useState } from 'react';
import SIPCalculator from './calculator-card';
import { Button } from '@/components/ui/button';
import { v7 } from 'uuid';

export default function SipPage() {
	const [calculators, setCalculators] = useState([v7()]);

	const addCalculator = () => {
		setCalculators([...calculators, v7()]);
	};

	const removeCalculator = (id: string) => {
		setCalculators(calculators.filter((calculator) => calculator !== id));
	};

	return (
		<div className='container mx-auto p-2'>
			<h1 className='text-2xl font-bold mb-4'>SIP Calculator Page</h1>
			<Button onClick={addCalculator}>Add Calculator</Button>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{calculators.map((id, index) => (
					<SIPCalculator
						key={id}
						id={id}
						index={index}
						removeCalculator={removeCalculator}
					/>
				))}
			</div>
		</div>
	);
}
