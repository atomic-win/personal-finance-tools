'use client';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import React, { useState } from 'react';

export default function SIPCalculatorCard({
	id,
	index,
	removeCalculator,
}: {
	id: string;
	index: number;
	removeCalculator: (id: string) => void;
}) {
	const [monthlyInvestment, setMonthlyInvestment] = useState(0);
	const [annualInterestRate, setAnnualInterestRate] = useState(0);
	const [investmentDuration, setInvestmentDuration] = useState(0);

	const investedAmount = monthlyInvestment * 12 * investmentDuration;
	const maturityAmount =
		investedAmount * Math.pow(1 + annualInterestRate / 100, investmentDuration);
	const interestAmount = maturityAmount - investedAmount;

	return (
		<Card className='mx-auto mt-10 p-2 rounded-lg shadow-md w-full'>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<CardTitle>SIP Calculator {index + 1}</CardTitle>
					<Button onClick={() => removeCalculator(id)}>
						<Trash2 className='size-4' />
					</Button>
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
						<Label htmlFor='interest'>Annual Interest Rate</Label>
						<Input
							id='interest'
							placeholder='0'
							type='number'
							onChange={(e) => setAnnualInterestRate(+e.target.value)}
						/>
					</div>
					<div className='flex flex-col space-y-1.5'>
						<Label htmlFor='duration'>Investment Duration (Years)</Label>
						<Input
							id='duration'
							placeholder='0'
							type='number'
							onChange={(e) => setInvestmentDuration(+e.target.value)}
						/>
					</div>
				</div>
			</CardContent>
			<CardFooter>
				{maturityAmount !== 0 && (
					<div className='p-4 bg-green-100 rounded-md w-full'>
						<h2 className='text-lg font-semibold text-green-700'>
							Maturity Amount: {maturityAmount.toFixed(2)}
						</h2>
						<p className='text-sm text-green-700'>
							Total Invested Amount: {investedAmount.toFixed(2)}
						</p>
						<p className='text-sm text-green-700'>
							Total Interest Earned: {interestAmount.toFixed(2)}
						</p>
					</div>
				)}
			</CardFooter>
		</Card>
	);
}
