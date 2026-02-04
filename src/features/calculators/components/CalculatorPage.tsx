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
import SidebarTriggerWithBreadcrumb from '@/components/sidebar-trigger-with-breadcrumb';
import { useEffect } from 'react';

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
	const { data: calculators, isFetching } = useCalculatorsQuery<T>(type);
	const { mutate: addCalculator } = useAddCalculatorMutation<T>(type);

	const calculatorsCount = (calculators || []).length;

	useEffect(() => {
		if (isFetching) {
			return;
		}

		if (calculatorsCount === 0) {
			addCalculator();
		}
	}, [isFetching, calculatorsCount, addCalculator]);

	return (
		<>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{ title: 'Calculators', href: '', disabled: true },
					{ title: calculatorName, href: `/calculators/${type}` },
				]}
			/>
			<div className='p-4 pt-0 space-y-2'>
				<h1 className='text-2xl font-bold'>
					{calculatorName} Calculator
				</h1>
				<p>{pageDescription}</p>
				<div className='flex justify-end'>
					<Button onClick={() => addCalculator()}>
						<PlusIcon />
						{`Add ${calculatorName} Calculator`}
					</Button>
				</div>
				<div className='grid grid-cols-[repeat(auto-fit,_minmax(12rem,_1fr))] gap-4'>
					{(calculators || []).map((calculator, index) => (
						<CalculatorCard<T>
							key={calculator.id}
							calculatorName={calculatorName}
							type={type}
							calculatorSchema={calculatorSchema}
							formFields={formFields}
							canRemove={calculatorsCount > 1}
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
