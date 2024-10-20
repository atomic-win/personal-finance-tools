'use client';
import { useState } from 'react';
import SWPCalculatorCard from '@/features/calculators/components/SWPCalculatorCard';
import { Button } from '@/components/ui/button';
import { v7 } from 'uuid';

export default function SWPPage() {
	const [calculators, setCalculators] = useState([v7()]);

	const addCalculator = () => {
		setCalculators([...calculators, v7()]);
	};

	const removeCalculator = (id: string) => {
		setCalculators(calculators.filter((calculator) => calculator !== id));
	};

	return (
		<div className='container mx-auto p-2'>
			<h1 className='text-2xl font-bold mb-4'>SWP Calculator</h1>
			<Button onClick={addCalculator}>Add Calculator</Button>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{calculators.map((id, index) => (
					<SWPCalculatorCard
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
