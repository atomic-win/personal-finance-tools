'use client';
import {
	SwpCalculator,
	swpCalculatorSchema,
} from '@/features/calculators/lib/types';
import CalculatorPage from '@/features/calculators/components/CalculatorPage';
import SwpCalculatorResult from '@/features/calculators/components/SwpCalculatorResult';

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

export default function Page() {
	const pageDescription = `A Systematic Withdrawal Plan (SWP) is a facility provided by mutual funds that allows investors to withdraw a fixed amount from their investment at regular intervals. SWP is a popular option for retirees who want to generate a regular income stream from their mutual fund investments. With our SWP calculator, you can estimate the amount you can withdraw regularly based on your investment amount, tenure, and expected returns.`;

	return (
		<CalculatorPage<SwpCalculator>
			calculatorName='SWP'
			pageDescription={pageDescription}
			type='swp'
			calculatorSchema={swpCalculatorSchema}
			formFields={formFields}
			CalculatorResult={SwpCalculatorResult}
		/>
	);
}
