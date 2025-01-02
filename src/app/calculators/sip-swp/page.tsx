'use client';
import {
	SipSwpCalculator,
	sipSwpCalculatorSchema,
} from '@/features/calculators/lib/types';
import CalculatorPage from '@/features/calculators/components/CalculatorPage';
import SipSwpCalculatorResult from '@/features/calculators/components/SipSwpCalculatorResult';

const formFields = [
	{
		name: 'lumpsumAmount',
		label: 'Lumpsum Amount',
		description: 'Enter the lumpsum amount',
	},
	{
		name: 'monthlySipInvestmentAmount',
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
		name: 'currentMonthlyExpenseAmount',
		label: 'Current Monthly Expense',
		description: 'Enter the current monthly expense amount',
	},
	{
		name: 'annualInflationPercent',
		label: 'Annual Inflation Rate (%)',
		description: 'Enter the annual inflation rate',
	},
];

export default function Page() {
	const pageDescription = `The SIP + SWP Calculator helps you plan your investments and withdrawals. Systematic Investment Plan (SIP) allows you to invest a fixed amount regularly, while Systematic Withdrawal Plan (SWP) enables you to withdraw a fixed amount periodically. Use this tool to simulate and manage your financial goals effectively.`;

	return (
		<CalculatorPage<SipSwpCalculator>
			calculatorName='SIP+SWP'
			pageDescription={pageDescription}
			type='sip-swp'
			calculatorSchema={sipSwpCalculatorSchema}
			formFields={formFields}
			CalculatorResult={SipSwpCalculatorResult}
		/>
	);
}
