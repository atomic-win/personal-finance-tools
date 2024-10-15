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
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formattedCurrencyAmount } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { Pie, PieChart } from 'recharts';

const chartConfig = {
	invested: {
		label: 'Invested Amount',
		color: 'hsl(var(--chart-6))',
	},
	returns: {
		label: 'Expected Returns',
		color: 'hsl(var(--chart-2))',
	},
} satisfies ChartConfig;

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
	const [annualInterestPercent, setAnnualInterestPercent] = useState(0);
	const [numberOfYears, setNumberOfYears] = useState(0);

	const numberOfMonths = numberOfYears * 12;
	const monthlyInterestRate = annualInterestPercent / 100 / 12;

	const investedAmount = numberOfMonths * monthlyInvestment;
	const expectedMaturityAmount =
		monthlyInterestRate === 0
			? investedAmount
			: (monthlyInvestment *
					(Math.pow(1 + monthlyInterestRate, numberOfMonths) - 1)) /
			  monthlyInterestRate;
	const expectedReturns = expectedMaturityAmount - investedAmount;

	const chartData = [
		{
			amountType: 'invested',
			amountValue: investedAmount,
			amountValuePercent:
				(investedAmount / Math.max(investedAmount, expectedMaturityAmount)) *
				100,
			fill: 'var(--color-invested)',
		},
		{
			amountType: 'returns',
			amountValue: expectedReturns,
			amountValuePercent:
				(expectedReturns / Math.max(investedAmount, expectedMaturityAmount)) *
				100,
			fill: 'var(--color-returns)',
		},
	];

	return (
		<Card className='mx-auto mt-10 p-2 rounded-lg shadow-md w-full'>
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
				<>
					<div className='mx-6 p-4 bg-green-100 rounded-md w-auto'>
						<h2 className='text-lg font-semibold text-green-700'>
							Expected Maturity Amount:{' '}
							{formattedCurrencyAmount(expectedMaturityAmount)}
						</h2>
						<p className='text-sm text-green-700'>
							Total Invested Amount: {formattedCurrencyAmount(investedAmount)}
						</p>
						<p className='text-sm text-green-700'>
							Expected Returns: {formattedCurrencyAmount(expectedReturns)}
						</p>
					</div>
					<ChartContainer config={chartConfig} className='mx-auto'>
						<PieChart>
							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent hideLabel />}
							/>
							<Pie
								data={chartData}
								dataKey='amountValue'
								nameKey='amountType'
								label={({ payload, ...props }) => {
									return (
										<text
											cx={props.cx}
											cy={props.cy}
											x={props.x}
											y={props.y}
											textAnchor={props.textAnchor}
											dominantBaseline={props.dominantBaseline}
											fill='hsla(var(--foreground))'>
											<tspan x={props.x} dy='0'>
												{`${
													chartConfig[
														payload.amountType as keyof typeof chartConfig
													]?.label
												}`}
											</tspan>
											<tspan x={props.x} dy='1.2em'>
												{`${formattedCurrencyAmount(
													payload.amountValue
												)} (${payload.amountValuePercent.toFixed(2)}%)`}
											</tspan>
										</text>
									);
								}}
							/>
						</PieChart>
					</ChartContainer>
				</>
			)}
		</Card>
	);
}
