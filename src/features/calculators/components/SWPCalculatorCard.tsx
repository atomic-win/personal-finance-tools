'use client';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	calculateSwpResult,
	displayCurrencyAmount,
	displayYearlyTimeDuration,
} from '@/features/calculators/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { SwpCalculator } from '@/features/calculators/lib/types';
import {
	useRemoveCalculatorMutation,
	useUpdateCalculatorMutation,
} from '@/features/calculators/hooks/swp';

const schema = z.object({
	totalInvestmentAmount: z.coerce.number().min(1, {
		message: 'Total Investment cannot be less than 1',
	}),
	monthlyWithdrawalAmount: z.coerce
		.number()
		.min(1, { message: 'Monthly Withdrawal cannot be less than 1' }),
	annualInterestPercent: z.coerce.number().min(-99, {
		message: 'Annual Interest Percent cannot be less than or equal to -100%',
	}),
	annualInflationPercent: z.coerce.number().min(-99, {
		message: 'Annual Inflation Percent cannot be less than or equal to -100%',
	}),
});

const formFields = [
	{
		name: 'totalInvestmentAmount',
		label: 'Total Investment',
		description: 'Enter the total investment amount',
	},
	{
		name: 'monthlyWithdrawalAmount',
		label: 'Monthly Withdrawal',
		description: 'Enter the monthly withdrawal amount',
	},
	{
		name: 'annualInterestPercent',
		label: 'Annual Interest Rate (%)',
		description: 'Enter the annual interest rate',
	},
	{
		name: 'annualInflationPercent',
		label: 'Annual Inflation Rate (%)',
		description: 'Enter the annual inflation rate',
	},
];

export default function SWPCalculatorCard({
	index,
	calculator,
	canRemove,
}: {
	index: number;
	calculator: SwpCalculator;
	canRemove: boolean;
}) {
	const { mutate: updateCalculator } = useUpdateCalculatorMutation();
	const { mutate: removeCalculator } = useRemoveCalculatorMutation();
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: calculator,
	});

	const result = calculateSwpResult(
		calculator.totalInvestmentAmount,
		calculator.monthlyWithdrawalAmount,
		calculator.annualInterestPercent,
		calculator.annualInflationPercent
	);

	function onFormChange(data: z.infer<typeof schema>) {
		updateCalculator({
			...calculator,
			...data,
		});
	}

	return (
		<Card className='mx-auto my-10 p-2 rounded-lg shadow-md w-full'>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<CardTitle>SWP Calculator {index + 1}</CardTitle>
					{canRemove && (
						<Button onClick={() => removeCalculator(calculator.id)}>
							<Trash2 className='size-4' />
						</Button>
					)}
				</div>
				<CardDescription>Calculate your SWP investments</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onChange={form.handleSubmit(onFormChange)}
						className='space-y-4'>
						{formFields.map((formField) => (
							<FormField
								key={formField.name}
								control={form.control}
								name={formField.name as keyof z.infer<typeof schema>}
								render={({ field }) => (
									<FormItem>
										<FormLabel>{formField.label}</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormDescription>{formField.description}</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						))}
					</form>
				</Form>
				{calculator.totalInvestmentAmount !== 0 && (
					<div className='mt-4 p-2 bg-green-100 rounded-md w-auto'>
						<table className='w-full'>
							<tbody>
								<tr>
									<td className='text-sm text-green-700 font-semibold'>
										Total Investment:
									</td>
									<td className='text-sm text-green-700 font-semibold'>
										{displayCurrencyAmount(calculator.totalInvestmentAmount)}
									</td>
								</tr>
								<tr>
									<td className='text-sm text-green-700 font-semibold'>
										Estimated Total Withdrawal:
									</td>
									<td className='text-sm text-green-700 font-semibold'>
										{displayCurrencyAmount(result.estimatedWithdrawalAmount)}
									</td>
								</tr>
								<tr>
									<td className='text-sm text-green-700 font-semibold'>
										Estimated Corpus Lasted:
									</td>
									<td className='text-sm text-green-700 font-semibold'>
										{displayYearlyTimeDuration(result.estimatedNumberOfYears)}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
