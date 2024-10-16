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
	annualInflationPercent: z.coerce.number().min(-99, {
		message: 'Annual Inflation Percent cannot be less than or equal to -100%',
	}),
	annualInterestPercent: z.coerce.number().min(-99, {
		message: 'Annual Interest Percent cannot be less than or equal to -100%',
	}),
	numberOfYears: z.coerce
		.number()
		.min(1, { message: 'Withdrawal Duration cannot be less than 1 year' }),
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
		name: 'annualInflationPercent',
		label: 'Annual Inflation (%)',
		description: 'Enter the annual inflation percentage',
	},
	{
		name: 'annualInterestPercent',
		label: 'Annual Interest (%)',
		description: 'Enter the annual interest percentage',
	},
	{
		name: 'numberOfYears',
		label: 'Time Period (Years)',
		description: 'Enter the time period in years',
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
			annualInflationPercent: 5,
			annualInterestPercent: 10,
			numberOfYears: 10,
		},
	});

	const [result, setResult] = useState({
		totalWithdrawalAmount: 0,
		finalBalanceAmount: 0,
	});

	const totalInvestmentAmount = Number(form.watch('totalInvestment'));
	const monthlyWithdrawalAmount = Number(form.watch('monthlyWithdrawal'));
	const annualInflationPercent = Number(form.watch('annualInflationPercent'));
	const annualInterestPercent = Number(form.watch('annualInterestPercent'));
	const numberOfYears = Number(form.watch('numberOfYears'));

	useEffect(() => {
		setResult(
			calculateResult(
				totalInvestmentAmount,
				monthlyWithdrawalAmount,
				annualInflationPercent,
				annualInterestPercent,
				numberOfYears
			)
		);
	}, [
		totalInvestmentAmount,
		monthlyWithdrawalAmount,
		annualInflationPercent,
		annualInterestPercent,
		numberOfYears,
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
										Total Withdrawal:
									</td>
									<td className='text-sm text-green-700 font-semibold'>
										{formattedCurrencyAmount(result.totalWithdrawalAmount)}
									</td>
								</tr>
								<tr>
									<td
										className={`text-sm font-semibold ${
											result.finalBalanceAmount < 0
												? 'text-red-700'
												: 'text-green-700'
										}`}>
										Expected Final Balance:
									</td>
									<td
										className={`text-sm font-semibold ${
											result.finalBalanceAmount < 0
												? 'text-red-700'
												: 'text-green-700'
										}`}>
										{formattedCurrencyAmount(result.finalBalanceAmount)}
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
	totalInvestment: number,
	monthlyWithdrawal: number,
	annualInflationPercent: number,
	annualInterestPercent: number,
	numberOfYears: number
) {
	const monthlyInterestRate =
		Math.pow(1 + annualInterestPercent / 100, 1 / 12) - 1;
	const annualInflationRate = annualInflationPercent / 100;

	let withdrawalAmount = 0;
	let balanceAmount = totalInvestment;

	for (let year = 0; year < numberOfYears; ++year) {
		for (let month = 0; month < 12; ++month) {
			withdrawalAmount += monthlyWithdrawal;
			balanceAmount -= monthlyWithdrawal;
			balanceAmount *= 1 + monthlyInterestRate;
		}
		monthlyWithdrawal *= 1 + annualInflationRate;
	}

	return {
		totalWithdrawalAmount: withdrawalAmount,
		finalBalanceAmount: balanceAmount,
	};
}
