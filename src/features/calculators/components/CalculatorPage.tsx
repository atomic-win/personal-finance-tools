'use client';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import {
	useAddCalculatorMutation,
	useCalculatorsQuery,
} from '@/features/calculators/hooks/calculators';
import { Calculator } from '@/features/calculators/lib/types';
import CalculatorCard from '@/features/calculators/components/CalculatorCard';
import { z } from 'zod';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';

export default function CalculatorPage<T extends Calculator>({
	calculatorName,
	pageDescription,
	type,
	calculatorSchema,
	formFields,
	CalculatorResult,
}: {
	calculatorName: string;
	pageDescription: string;
	type: T['type'];
	calculatorSchema: z.Schema;
	formFields: {
		name: string;
		label: string;
	}[];
	CalculatorResult: React.ComponentType<{ calculator: T }>;
}) {
	const { data: calculators } = useCalculatorsQuery<T>(type);
	const { mutate: addCalculator } = useAddCalculatorMutation<T>(type);

	return (
		<>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{ title: 'Calculators', href: '', disabled: true },
					{ title: calculatorName, href: `/calculators/${type}` },
				]}
			/>
			<div className='px-4 space-y-2'>
				<h1 className='text-2xl font-bold'>{calculatorName} Calculator</h1>
				<p>{pageDescription}</p>
				<div className='flex justify-end'>
					<Button onClick={() => addCalculator()}>
						<PlusIcon />
						{`Add ${calculatorName} Calculator`}
					</Button>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{(calculators || []).map((calculator, index) => (
						<CalculatorCard<T>
							key={calculator.id}
							calculatorName={calculatorName}
							type={type}
							calculatorSchema={calculatorSchema}
							formFields={formFields}
							index={index}
							calculator={calculator}
							CalculatorResult={CalculatorResult}
						/>
					))}
				</div>
			</div>
		</>
	);
}
