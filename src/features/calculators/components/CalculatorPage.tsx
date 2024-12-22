'use client';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import {
	useAddCalculatorMutation,
	useCalculatorsQuery,
} from '@/features/calculators/hooks/calculators';
import { Calculator } from '@/features/calculators/lib/types';

export default function CalculatorPage<T extends Calculator>({
	calculatorName,
	pageDescription,
	type,
	CalculatorCard,
}: {
	calculatorName: string;
	pageDescription: string;
	type: T['type'];
	CalculatorCard: React.ComponentType<{
		index: number;
		calculator: T;
		canRemove: boolean;
	}>;
}) {
	const { data: calculators } = useCalculatorsQuery<T>(type);
	const { mutate: addCalculator } = useAddCalculatorMutation<T>(type);

	return (
		<div className='container mx-auto p-2'>
			<h1 className='text-2xl font-bold mb-4'>{calculatorName} Calculator</h1>
			<p>{pageDescription}</p>
			<div className='flex justify-end'>
				<Button onClick={() => addCalculator()}>
					<PlusIcon />
					{`Add ${calculatorName} Calculator`}
				</Button>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{(calculators || []).map((calculator, index) => (
					<CalculatorCard
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
