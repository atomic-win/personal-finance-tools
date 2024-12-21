'use client';
import SIPSWPCalculatorCard from '@/features/calculators/components/SIPSWPCalculatorCard';
import { Button } from '@/components/ui/button';
import {
	useAddCalculatorMutation,
	useCalculatorsQuery,
} from '@/features/calculators/hooks/sip-swp';
import { PlusIcon } from 'lucide-react';

export default function Page() {
	const { data: calculators } = useCalculatorsQuery();
	const { mutate: addCalculator } = useAddCalculatorMutation();

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
				<Button onClick={() => addCalculator()}>
					<PlusIcon />
					Add Calculator
				</Button>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{(calculators || []).map((calculator, index) => (
					<SIPSWPCalculatorCard
						key={calculator.id}
						index={index}
						calculator={calculator}
						canRemove={(calculators || []).length > 1}
					/>
				))}
			</div>
		</div>
	);
}
