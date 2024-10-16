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
import React, { useEffect } from 'react';
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

	const [totalWithdrawalAmount, setTotalWithdrawalAmount] = React.useState(0);
	const [finalBalanceAmount, setFinalBalanceAmount] = React.useState(0);

	const totalInvestmentAmount = Number(form.watch('totalInvestment'));
	const monthlyWithdrawalAmount = Number(form.watch('monthlyWithdrawal'));
	const annualInflationPercent = Number(form.watch('annualInflationPercent'));
	const annualInterestPercent = Number(form.watch('annualInterestPercent'));
	const numberOfYears = Number(form.watch('numberOfYears'));

	useEffect(() => {
		setTotalWithdrawalAmount(
			calculateTotalWithdrawalAmount(
				monthlyWithdrawalAmount,
				annualInflationPercent,
				numberOfYears
			)
		);

		setFinalBalanceAmount(
			calculateFinalBalanceAmount(
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
					<form onChange={() => {}} className='space-y-4'>
						<FormField
							control={form.control}
							name='totalInvestment'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Total Investment</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormDescription>
										Enter the total investment amount
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='monthlyWithdrawal'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Monthly Withdrawal</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormDescription>
										Enter the monthly withdrawal amount
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='annualInflationPercent'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Annual Inflation (%)</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormDescription>
										Enter the annual inflation percentage
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='annualInterestPercent'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Annual Interest (%)</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormDescription>
										Enter the annual interest percentage
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='numberOfYears'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Time Period (Years)</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormDescription>
										Enter the time period in years
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
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
										{formattedCurrencyAmount(totalWithdrawalAmount)}
									</td>
								</tr>
								<tr>
									<td className='text-sm text-green-700 font-semibold'>
										Expected Final Balance:
									</td>
									<td className='text-sm text-green-700 font-semibold'>
										{formattedCurrencyAmount(finalBalanceAmount)}
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

function calculateTotalWithdrawalAmount(
	monthlyWithdrawal: number,
	annualInflationPercent: number,
	numberOfYears: number
) {
	const annualInflationRate = annualInflationPercent / 100;

	let withdrawalAmount = 0;

	for (let year = 0; year < numberOfYears; ++year) {
		withdrawalAmount +=
			12 * monthlyWithdrawal * Math.pow(1 + annualInflationRate, year);
	}

	return withdrawalAmount;
}

function calculateFinalBalanceAmount(
	totalInvestment: number,
	monthlyWithdrawal: number,
	annualInflationPercent: number,
	annualInterestPercent: number,
	numberOfYears: number
) {
	const monthlyInterestRate =
		Math.pow(1 + annualInterestPercent / 100, 1 / 12) - 1;
	const annualInflationRate = annualInflationPercent / 100;

	let balanceAmount = totalInvestment;

	for (let year = 0; year < numberOfYears; ++year) {
		for (let month = 0; month < 12; ++month) {
			balanceAmount -= monthlyWithdrawal;
			balanceAmount *= 1 + monthlyInterestRate;
		}
		monthlyWithdrawal *= 1 + annualInflationRate;
	}

	return balanceAmount;
}
