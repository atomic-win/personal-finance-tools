'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import {
	Controller,
	type DefaultValues,
	type Path,
	useForm,
} from 'react-hook-form';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
	useRemoveCalculatorMutation,
	useUpdateCalculatorMutation,
} from '@/features/calculators/hooks/calculators';
import type { Calculator } from '@/features/calculators/lib/types';

export default function CalculatorCard<T extends Calculator>({
	calculatorName,
	type,
	calculatorSchema,
	formFields,
	canRemove,
	index,
	calculator,
	CalculatorResult,
}: {
	calculatorName: string;
	type: T['type'];
	calculatorSchema: z.Schema;
	formFields: {
		name: string;
		label: string;
	}[];
	canRemove: boolean;
	index: number;
	calculator: T;
	CalculatorResult: React.ComponentType<{ calculator: T }>;
}) {
	const { mutate: updateCalculator } = useUpdateCalculatorMutation<T>(type);
	const { mutate: removeCalculator } = useRemoveCalculatorMutation<T>(type);

	const form = useForm<T>({
		resolver: zodResolver(calculatorSchema),
		defaultValues: calculator as DefaultValues<T>,
	});

	function onFormChange(data: T) {
		updateCalculator({ ...calculator, ...data });
	}

	return (
		<Card className='rounded-lg shadow-md max-w-md'>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<CardTitle>
						{calculatorName} Calculator {index + 1}
					</CardTitle>
					{canRemove && (
						<Button onClick={() => removeCalculator(calculator.id)}>
							<Trash2 className='size-4' />
						</Button>
					)}
				</div>
			</CardHeader>
			<CardContent>
				<form onChange={form.handleSubmit(onFormChange)} className='space-y-4'>
					{formFields.map((formField) => (
						<Controller
							key={formField.name}
							control={form.control}
							name={formField.name as Path<T>}
							render={({ field }) => (
								<Field>
									<FieldLabel>{formField.label}</FieldLabel>
									<Input {...field} />
									<FieldError
										errors={[
											form.formState.errors[formField.name as Path<T>] as {
												message?: string;
											},
										]}
									/>
								</Field>
							)}
						/>
					))}
				</form>
				<CalculatorResult calculator={calculator} />
			</CardContent>
		</Card>
	);
}
