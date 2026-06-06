import { createFileRoute } from '@tanstack/react-router';
import CalculatorPage from '@/features/calculators/components/CalculatorPage';
import SipSwpCalculatorResult from '@/features/calculators/components/SipSwpCalculatorResult';
import {
	type SipSwpCalculator,
	sipSwpCalculatorSchema,
} from '@/features/calculators/lib/types';

const formFields = [
	{
		name: 'lumpsumAmount',
		label: 'Initial Lumpsum Amount',
	},
	{
		name: 'monthlySipInvestmentAmount',
		label: 'Monthly SIP Investment Amount',
	},
	{
		name: 'annualSipStepUpPercent',
		label: 'Annual SIP Step-Up (%)',
	},
	{
		name: 'annualInterestPercent',
		label: 'Annual Interest Rate (%)',
	},
	{
		name: 'numberOfSipYears',
		label: 'SIP Investment Duration (Years)',
	},
	{
		name: 'currentMonthlyExpenseAmount',
		label: 'Current Monthly Expense',
	},
	{
		name: 'annualInflationPercent',
		label: 'Annual Inflation Rate (%)',
	},
];

const pageDescription = `The SIP + SWP Calculator helps you plan your investments and withdrawals. Systematic Investment Plan (SIP) allows you to invest a fixed amount regularly, while Systematic Withdrawal Plan (SWP) enables you to withdraw a fixed amount periodically. Use this tool to simulate and manage your financial goals effectively.`;

export const Route = createFileRoute('/calculators/sip-swp')({
	component: Page,
});

function Page() {
	return (
		<>
			<title>SIP + SWP Calculator</title>
			<meta name='description' content={pageDescription} />
			<meta
				name='keywords'
				content='SIP, SWP, Systematic Investment Plan, Systematic Withdrawal Plan, Step Up, Mutual Funds, Investment, Financial Planning'
			/>
			<CalculatorPage<SipSwpCalculator>
				calculatorName='SIP+SWP'
				pageDescription={pageDescription}
				type='sip-swp'
				calculatorSchema={sipSwpCalculatorSchema}
				formFields={formFields}
				CalculatorResult={SipSwpCalculatorResult}
			/>
		</>
	);
}
