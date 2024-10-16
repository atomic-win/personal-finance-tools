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
import { calculateSwpResult } from '@/lib/calculator.utils';
import {
	formattedCurrencyAmount,
	formattedYearlyTimeDuration,
} from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const SWPCalculatorSchema = z.object({
	totalInvestment: z.coerce.number().min(1, {
		message: 'Total Investment cannot be less than 1',
	}),
	monthlyWithdrawal: z.coerce
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
		name: 'totalInvestment',
		label: 'Total Investment',
		description: 'Enter the total investment amount',
	},
	{
		name: 'monthlyWithdrawal',
		label: 'Monthly Withdrawal',
		description: 'Enter the monthly withdrawal amount',
	},
	{
		name: 'annualInterestPercent',
		label: 'Annual Interest (%)',
		description: 'Enter the annual interest percentage',
	},
	{
		name: 'annualInflationPercent',
		label: 'Annual Inflation (%)',
		description: 'Enter the annual inflation percentage',
	},
];

export default function SWPCalculatorCard({
	id,
	index,
	canRemove,
	removeCalculator,
}: {
	id: string;
	index: number;
	canRemove: boolean;
	removeCalculator: (id: string) => void;
}) {
	const form = useForm<z.infer<typeof SWPCalculatorSchema>>({
		resolver: zodResolver(SWPCalculatorSchema),
		defaultValues: {
			totalInvestment: 1000000,
			monthlyWithdrawal: 10000,
			annualInflationPercent: 8,
			annualInterestPercent: 10,
		},
	});

	const [result, setResult] = useState({
		estimatedWithdrawalAmount: 0,
		estimatedNumberOfYears: 0,
	});

	const totalInvestmentAmount = Number(form.watch('totalInvestment'));
	const monthlyWithdrawalAmount = Number(form.watch('monthlyWithdrawal'));
	const annualInterestPercent = Number(form.watch('annualInterestPercent'));
	const annualInflationPercent = Number(form.watch('annualInflationPercent'));

	useEffect(() => {
		setResult(
			calculateSwpResult(
				totalInvestmentAmount,
				monthlyWithdrawalAmount,
				annualInterestPercent,
				annualInflationPercent
			)
		);
	}, [
		totalInvestmentAmount,
		monthlyWithdrawalAmount,
		annualInterestPercent,
		annualInflationPercent,
	]);

	return (
		<Card className='mx-auto my-10 p-2 rounded-lg shadow-md w-full'>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<CardTitle>SWP Calculator {index + 1}</CardTitle>
					{canRemove && (
						<Button onClick={() => removeCalculator(id)}>
							<Trash2 className='size-4' />
						</Button>
					)}
				</div>
				<CardDescription>Calculate your SWP investments</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onChange={form.handleSubmit(() => {})} className='space-y-4'>
						{formFields.map((formField) => (
							<FormField
								key={formField.name}
								control={form.control}
								name={
									formField.name as keyof z.infer<typeof SWPCalculatorSchema>
								}
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
				{totalInvestmentAmount !== 0 && (
					<div className='mt-4 p-2 bg-green-100 rounded-md w-auto'>
						<table className='w-full'>
							<tbody>
								<tr>
									<td className='text-sm text-green-700 font-semibold'>
										Total Investment:
									</td>
									<td className='text-sm text-green-700 font-semibold'>
										{formattedCurrencyAmount(totalInvestmentAmount)}
									</td>
								</tr>
								<tr>
									<td className='text-sm text-green-700 font-semibold'>
										Estimated Total Withdrawal:
									</td>
									<td className='text-sm text-green-700 font-semibold'>
										{formattedCurrencyAmount(result.estimatedWithdrawalAmount)}
									</td>
								</tr>
								<tr>
									<td className='text-sm text-green-700 font-semibold'>
										Estimated Corpus Lasted:
									</td>
									<td className='text-sm text-green-700 font-semibold'>
										{formattedYearlyTimeDuration(result.estimatedNumberOfYears)}
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
