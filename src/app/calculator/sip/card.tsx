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
import React from 'react';
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

	const [investedAmount, setInvestedAmount] = React.useState(0);
	const [expectedMaturityAmount, setExpectedMaturityAmount] = React.useState(0);
	const [expectedReturns, setExpectedReturns] = React.useState(0);
	const [investedAmountPercent, setInvestedAmountPercent] = React.useState(0);
	const [expectedReturnsPercent, setExpectedReturnsPercent] = React.useState(0);

	const monthlyInvestment = Number(form.watch('monthlyInvestment'));
	const annualStepUpPercent = Number(form.watch('annualStepUpPercent'));
	const annualInterestPercent = Number(form.watch('annualInterestPercent'));
	const numberOfYears = Number(form.watch('numberOfYears'));

	React.useEffect(() => {
		const invested = calculateInvestedAmount(
			monthlyInvestment,
			annualStepUpPercent,
			numberOfYears
		);

		const maturity = calculateMaturityAmount(
			monthlyInvestment,
			annualInterestPercent,
			annualStepUpPercent,
			numberOfYears
		);

		const returns = maturity - invested;

		setInvestedAmount(invested);
		setExpectedMaturityAmount(maturity);
		setExpectedReturns(returns);
		setInvestedAmountPercent((invested / Math.max(1, maturity)) * 100);
		setExpectedReturnsPercent((returns / Math.max(1, maturity)) * 100);
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
				{expectedMaturityAmount !== 0 && (
					<div className='mt-4 p-2 bg-green-100 rounded-md w-auto'>
						<table className='w-full'>
							<tbody>
								<tr>
									<td className='text-sm text-green-700 font-semibold'>
										Invested Amount:
									</td>
									<td className='text-sm text-green-700 font-semibold'>
										{formattedCurrencyAmount(investedAmount)} (
										{investedAmountPercent.toFixed(2)}%)
									</td>
								</tr>
								<tr>
									<td className='text-sm text-green-700 font-semibold'>
										Expected Returns:
									</td>
									<td className='text-sm text-green-700 font-semibold'>
										{formattedCurrencyAmount(expectedReturns)} (
										{expectedReturnsPercent.toFixed(2)}%)
									</td>
								</tr>
								<tr>
									<td className='text-sm text-green-700 font-semibold'>
										Expected Total Value:
									</td>
									<td className='text-sm text-green-700 font-semibold'>
										{formattedCurrencyAmount(expectedMaturityAmount)}
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

function calculateInvestedAmount(
	monthlyInvestment: number,
	annualStepUpPercent: number,
	numberOfYears: number
) {
	let investedAmount = 0;
	for (let year = 0; year < numberOfYears; ++year) {
		investedAmount += monthlyInvestment * 12;
		monthlyInvestment *= 1 + annualStepUpPercent / 100;
	}
	return investedAmount;
}

function calculateMaturityAmount(
	monthlyInvestment: number,
	annualInterestPercent: number,
	annualStepUpPercent: number,
	numberOfYears: number
) {
	const monthlyInterestRate =
		Math.pow(1 + annualInterestPercent / 100, 1 / 12) - 1;

	let maturityAmount = 0;

	for (let year = 0; year < numberOfYears; ++year) {
		for (let month = 0; month < 12; ++month) {
			maturityAmount += monthlyInvestment;
			monthlyInvestment *= 1 + monthlyInterestRate;
		}
		monthlyInvestment *= 1 + annualStepUpPercent / 100;
	}

	return maturityAmount;
}
