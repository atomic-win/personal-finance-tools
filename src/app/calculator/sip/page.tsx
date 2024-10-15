'use client';
import { useState } from 'react';
import SIPCalculator from './calculator-card';

export default function SipPage() {
	const [calculators, setCalculators] = useState([{ id: 1 }]);

	const addCalculator = () => {
		setCalculators([...calculators, { id: calculators.length + 1 }]);
	};

	const removeCalculator = (id: number) => {
		setCalculators(calculators.filter((calculator) => calculator.id !== id));
	};

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>SIP Calculator Page</h1>
			<button
				onClick={addCalculator}
				className='mb-4 p-2 bg-blue-500 text-white rounded'>
				Add Calculator
			</button>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{calculators.map((calculator) => (
					<SIPCalculator
						key={calculator.id}
						id={calculator.id}
						removeCalculator={removeCalculator}
					/>
				))}
			</div>
		</div>
	);
}
