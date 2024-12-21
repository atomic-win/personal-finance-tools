'use client';
import SwpCalculatorCard from '@/features/calculators/components/SwpCalculatorCard';
import { Button } from '@/components/ui/button';
import {
	useAddCalculatorMutation,
	useCalculatorsQuery,
} from '@/features/calculators/hooks/calculators';
import { PlusIcon } from 'lucide-react';
import { SwpCalculator } from '@/features/calculators/lib/types';

export default function Page() {
	const { data: calculators } = useCalculatorsQuery<SwpCalculator>('swp');
	const { mutate: addCalculator } =
		useAddCalculatorMutation<SwpCalculator>('swp');

	return (
		<div className='container mx-auto p-2'>
			<h1 className='text-2xl font-bold mb-4'>SWP Calculator</h1>
			<p>
				A Systematic Withdrawal Plan (SWP) is a facility provided by mutual
				funds that allows investors to withdraw a fixed amount from their
				investment at regular intervals. SWP is a popular option for retirees
				who want to generate a regular income stream from their mutual fund
				investments. With our SWP calculator, you can estimate the amount you
				can withdraw regularly based on your investment amount, tenure, and
				expected returns.
			</p>
			<div className='flex justify-end'>
				<Button onClick={() => addCalculator()}>
					<PlusIcon />
					Add Calculator
				</Button>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{calculators.map((calculator, index) => (
					<SwpCalculatorCard
						key={calculator.id}
						index={index}
						calculator={calculator}
						canRemove={calculators.length > 1 || index !== 0}
					/>
				))}
			</div>
		</div>
	);
}
