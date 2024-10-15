'use client';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formattedCurrencyAmount } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import React, { useState } from 'react';

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
	const [monthlyInvestment, setMonthlyInvestment] = useState(0);
	const [annualStepUpPercent, setAnnualStepUpPercent] = useState(0);
	const [annualInterestPercent, setAnnualInterestPercent] = useState(0);
	const [numberOfYears, setNumberOfYears] = useState(0);

	const investedAmount = calculateInvestedAmount(
		monthlyInvestment,
		annualStepUpPercent,
		numberOfYears
	);

	const expectedMaturityAmount = calculateMaturityAmount(
		monthlyInvestment,
		annualInterestPercent,
		annualStepUpPercent,
		numberOfYears
	);

	const expectedReturns = expectedMaturityAmount - investedAmount;

	const investedAmountPercent =
		(investedAmount / Math.max(1, expectedMaturityAmount)) * 100;
	const expectedReturnsPercent =
		(expectedReturns / Math.max(1, expectedMaturityAmount)) * 100;

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
				<div className='grid w-full items-center gap-4'>
					<div className='flex flex-col space-y-1.5'>
						<Label htmlFor='name'>Monthly Installment</Label>
						<Input
							id='monthly-installment'
							placeholder='0'
							type='number'
							onChange={(e) => setMonthlyInvestment(+e.target.value)}
						/>
					</div>
					<div className='flex flex-col space-y-1.5'>
						<Label htmlFor='interest'>Annual Interest Rate (%)</Label>
						<Input
							id='interest'
							placeholder='0'
							type='number'
							onChange={(e) => setAnnualInterestPercent(+e.target.value)}
						/>
					</div>
					<div className='flex flex-col space-y-1.5'>
						<Label htmlFor='step-up'>Annual Step-Up (%)</Label>
						<Input
							id='step-up'
							placeholder='0'
							type='number'
							onChange={(e) => setAnnualStepUpPercent(+e.target.value)}
						/>
					</div>
					<div className='flex flex-col space-y-1.5'>
						<Label htmlFor='duration'>Investment Duration (Years)</Label>
						<Input
							id='duration'
							placeholder='0'
							type='number'
							onChange={(e) => setNumberOfYears(+e.target.value)}
						/>
					</div>
				</div>
			</CardContent>
			{expectedMaturityAmount !== 0 && (
				<div className='mx-6 mb-6 p-4 bg-green-100 rounded-md w-auto'>
					<h2 className='text-lg font-semibold text-green-700'>
						Expected Maturity Amount:{' '}
						{formattedCurrencyAmount(expectedMaturityAmount)}
					</h2>
					<p className='text-sm text-green-700'>
						Total Invested Amount: {formattedCurrencyAmount(investedAmount)} (
						{investedAmountPercent.toFixed(2)}%)
					</p>
					<p className='text-sm text-green-700'>
						Expected Returns: {formattedCurrencyAmount(expectedReturns)} (
						{expectedReturnsPercent.toFixed(2)}%)
					</p>
				</div>
			)}
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
