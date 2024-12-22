'use client';
import {
	SwpCalculator,
	swpCalculatorSchema,
} from '@/features/calculators/lib/types';
import SwpCalculatorResult from '@/features/calculators/components/SwpCalculatorResult';
import CalculatorCard from '@/features/calculators/components/CalculatorCard';

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

export default function SwpCalculatorCard({
	index,
	calculator,
}: {
	index: number;
	calculator: SwpCalculator;
}) {
	return (
		<CalculatorCard<SwpCalculator>
			index={index}
			calculator={calculator}
			formFields={formFields}
			calculatorSchema={swpCalculatorSchema}
			calculatorName='SWP'
			type='swp'
			CalculatorResult={SwpCalculatorResult}
		/>
	);
}
