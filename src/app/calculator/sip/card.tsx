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
import { formattedCurrencyAmount } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const SIPCalculatorSchema = z.object({
	monthlyInvestment: z.coerce
		.number()
		.min(1, { message: 'Monthly Investment cannot be less than 1' }),
	annualStepUpPercent: z.coerce.number().min(-99, {
		message: 'Annual Step-Up Percent cannot be less than or equal to -100%',
	}),
	annualInterestPercent: z.coerce.number().min(-99, {
		message: 'Annual Interest Percent cannot be less than or equal to -100%',
	}),
	numberOfYears: z.coerce
		.number()
		.min(1, { message: 'Investment Duration cannot be less than 1 year' }),
});

const formFields = [
	{
		name: 'monthlyInvestment',
		label: 'Monthly Installment',
		description: 'Enter the monthly installment',
	},
	{
		name: 'annualInterestPercent',
		label: 'Annual Interest Rate (%)',
		description: 'Enter the annual interest rate',
	},
	{
		name: 'annualStepUpPercent',
		label: 'Annual Step-Up (%)',
		description: 'Enter the annual step-up percentage',
	},
	{
		name: 'numberOfYears',
		label: 'Investment Duration (Years)',
		description: 'Enter the investment duration in years',
	},
];

export default function SIPCalculatorCard({
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
	const form = useForm<z.infer<typeof SIPCalculatorSchema>>({
		resolver: zodResolver(SIPCalculatorSchema),
		defaultValues: {
			monthlyInvestment: 500,
			annualStepUpPercent: 10,
			annualInterestPercent: 10,
			numberOfYears: 10,
		},
	});

	const [result, setResult] = useState({
		totalInvestedAmount: 0,
		estimatedFinalValue: 0,
		estimatedReturns: 0,
		investedAmountPercent: 0,
		estimatedReturnsPercent: 0,
	});

	const monthlyInvestment = Number(form.watch('monthlyInvestment'));
	const annualStepUpPercent = Number(form.watch('annualStepUpPercent'));
	const annualInterestPercent = Number(form.watch('annualInterestPercent'));
	const numberOfYears = Number(form.watch('numberOfYears'));

	React.useEffect(() => {
		setResult(
			calculateResult(
				monthlyInvestment,
				annualInterestPercent,
				annualStepUpPercent,
				numberOfYears
			)
		);
	}, [
		monthlyInvestment,
		annualStepUpPercent,
		annualInterestPercent,
		numberOfYears,
	]);

	return (
		<Card className='mx-auto my-10 p-2 rounded-lg shadow-md w-full'>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<CardTitle>SIP Calculator {index + 1}</CardTitle>
					{canRemove && (
						<Button onClick={() => removeCalculator(id)}>
							<Trash2 className='size-4' />
						</Button>
					)}
				</div>
				<CardDescription>Calculate your SIP investments</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onChange={form.handleSubmit(() => {})} className='space-y-4'>
						{formFields.map((formField) => (
							<FormField
								key={formField.name}
								control={form.control}
								name={
									formField.name as keyof z.infer<typeof SIPCalculatorSchema>
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
				{result.estimatedFinalValue !== 0 && (
					<div className='mt-4 p-2 bg-green-100 rounded-md w-auto'>
						<table className='w-full'>
							<tbody>
								<tr>
									<td className='text-green-700 font-semibold'>
										Estimated Final Value:
									</td>
									<td className='text-green-700 font-semibold'>
										{formattedCurrencyAmount(result.estimatedFinalValue)}
									</td>
								</tr>
								<tr>
									<td className='text-sm text-green-700 font-semibold'>
										Total Invested Amount:
									</td>
									<td className='text-sm text-green-700 font-semibold'>
										{formattedCurrencyAmount(result.totalInvestedAmount)} (
										{result.investedAmountPercent.toFixed(2)}%)
									</td>
								</tr>
								<tr>
									<td className='text-sm text-green-700 font-semibold'>
										Estimated Returns:
									</td>
									<td className='text-sm text-green-700 font-semibold'>
										{formattedCurrencyAmount(result.estimatedReturns)} (
										{result.estimatedReturnsPercent.toFixed(2)}%)
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

function calculateResult(
	monthlyInvestment: number,
	annualInterestPercent: number,
	annualStepUpPercent: number,
	numberOfYears: number
) {
	const annualInterestRate = annualInterestPercent / 100;
	const monthlyInterestRate = Math.pow(1 + annualInterestRate, 1 / 12) - 1;

	let totalInvestedAmount = 0;
	let estimatedFinalValue = 0;

	for (let year = 0; year < numberOfYears; ++year) {
		for (let month = 0; month < 12; ++month) {
			totalInvestedAmount += monthlyInvestment;
			estimatedFinalValue += monthlyInvestment;
			estimatedFinalValue *= 1 + monthlyInterestRate;
		}
		monthlyInvestment *= 1 + annualStepUpPercent / 100;
	}

	const estimatedReturns = estimatedFinalValue - totalInvestedAmount;
	const investedAmountPercent =
		(totalInvestedAmount / Math.max(1, estimatedFinalValue)) * 100;
	const estimatedReturnsPercent =
		(estimatedReturns / Math.max(1, estimatedFinalValue)) * 100;

	return {
		totalInvestedAmount,
		estimatedFinalValue,
		estimatedReturns,
		investedAmountPercent,
		estimatedReturnsPercent,
	};
}
