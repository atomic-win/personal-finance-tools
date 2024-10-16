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
import { calculateSipResult, calculateSwpResult } from '@/lib/calculator.utils';
import {
	formattedCurrencyAmount,
	formattedYearlyTimeDuration,
} from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const CalculatorSchema = z.object({
	lumpsumAmount: z.coerce.number().min(0, {
		message: 'Lumpsum Amount cannot be less than 0',
	}),
	monthlySipInvestment: z.coerce
		.number()
		.min(1, { message: 'Monthly SIP Investment cannot be less than 1' }),
	annualSipStepUpPercent: z.coerce.number().min(-99, {
		message: 'Annual SIP Step-Up Percent cannot be less than or equal to -100%',
	}),
	annualInterestPercent: z.coerce.number().min(-99, {
		message: 'Annual Interest Percent cannot be less than or equal to -100%',
	}),
	numberOfSipYears: z.coerce
		.number()
		.min(1, { message: 'SIP Investment Duration cannot be less than 1 year' }),
	monthlySwpWithdrawal: z.coerce
		.number()
		.min(1, { message: 'Monthly SWP Withdrawal cannot be less than 1' }),
	annualInflationPercent: z.coerce.number().min(-99, {
		message: 'Annual Inflation Percent cannot be less than or equal to -100%',
	}),
});

const formFields = [
	{
		name: 'lumpsumAmount',
		label: 'Lumpsum Amount',
		description: 'Enter the lumpsum amount',
	},
	{
		name: 'monthlySipInvestment',
		label: 'Monthly SIP Investment',
		description: 'Enter the monthly SIP investment amount',
	},
	{
		name: 'annualSipStepUpPercent',
		label: 'Annual SIP Step-Up (%)',
		description: 'Enter the annual SIP step-up percentage',
	},
	{
		name: 'annualInterestPercent',
		label: 'Annual Interest Rate (%)',
		description: 'Enter the annual interest rate',
	},
	{
		name: 'numberOfSipYears',
		label: 'SIP Investment Duration (Years)',
		description: 'Enter the SIP investment duration in years',
	},
	{
		name: 'monthlySwpWithdrawal',
		label: 'Monthly SWP Withdrawal',
		description: 'Enter the monthly SWP withdrawal amount',
	},
	{
		name: 'annualInflationPercent',
		label: 'Annual Inflation (%)',
		description: 'Enter the annual inflation percentage',
	},
];

export default function CalculatorCard({
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
	const form = useForm<z.infer<typeof CalculatorSchema>>({
		resolver: zodResolver(CalculatorSchema),
		defaultValues: {
			lumpsumAmount: 0,
			monthlySipInvestment: 500,
			annualSipStepUpPercent: 10,
			annualInterestPercent: 10,
			numberOfSipYears: 10,
			monthlySwpWithdrawal: 10000,
			annualInflationPercent: 5,
		},
	});

	const [result, setResult] = useState({
		totalInvestedAmount: 0,
		estimatedTotalValueAfterSip: 0,
		estimatedWithdrawalAmount: 0,
		estimatedNumberOfYears: 0,
	});

	const lumpsumAmount = Number(form.watch('lumpsumAmount'));
	const monthlySipInvestment = Number(form.watch('monthlySipInvestment'));
	const annualSipStepUpPercent = Number(form.watch('annualSipStepUpPercent'));
	const annualInterestPercent = Number(form.watch('annualInterestPercent'));
	const numberOfSipYears = Number(form.watch('numberOfSipYears'));
	const monthlySwpWithdrawal = Number(form.watch('monthlySwpWithdrawal'));
	const annualInflationPercent = Number(form.watch('annualInflationPercent'));

	React.useEffect(() => {
		const {
			totalInvestedAmount,
			estimatedTotalValue: estimatedTotalValueAfterSip,
		} = calculateSipResult(
			lumpsumAmount,
			monthlySipInvestment,
			annualSipStepUpPercent,
			annualInterestPercent,
			numberOfSipYears
		);

		const { estimatedWithdrawalAmount, estimatedNumberOfYears } =
			calculateSwpResult(
				estimatedTotalValueAfterSip,
				monthlySwpWithdrawal,
				annualInflationPercent,
				annualInterestPercent
			);

		setResult({
			totalInvestedAmount,
			estimatedTotalValueAfterSip,
			estimatedWithdrawalAmount,
			estimatedNumberOfYears,
		});
	}, [
		lumpsumAmount,
		monthlySipInvestment,
		annualSipStepUpPercent,
		annualInterestPercent,
		numberOfSipYears,
		monthlySwpWithdrawal,
		annualInflationPercent,
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
								name={formField.name as keyof z.infer<typeof CalculatorSchema>}
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
				{result.totalInvestedAmount !== 0 && (
					<div className='mt-4 p-2 bg-green-100 rounded-md w-auto'>
						<table className='w-full'>
							<tbody>
								<tr>
									<td className='text-sm text-green-700 font-semibold'>
										Total Invested Amount:
									</td>
									<td className='text-sm text-green-700 font-semibold'>
										{formattedCurrencyAmount(result.totalInvestedAmount)}
									</td>
								</tr>
								<tr>
									<td className='text-sm text-green-700 font-semibold'>
										Estimated Total Value After SIP:
									</td>
									<td className='text-sm text-green-700 font-semibold'>
										{formattedCurrencyAmount(
											result.estimatedTotalValueAfterSip
										)}
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
