import { createFileRoute } from '@tanstack/react-router';
import CalculatorPage from '@/features/calculators/components/CalculatorPage';
import SwpCalculatorResult from '@/features/calculators/components/SwpCalculatorResult';
import {
	type SwpCalculator,
	swpCalculatorSchema,
} from '@/features/calculators/lib/types';

const formFields = [
	{
		name: 'totalInvestmentAmount',
		label: 'Total Investment Amount',
	},
	{
		name: 'monthlyWithdrawalAmount',
		label: 'Monthly Withdrawal Amount',
	},
	{
		name: 'annualInterestPercent',
		label: 'Annual Interest Rate (%)',
	},
	{
		name: 'annualInflationPercent',
		label: 'Annual Inflation Rate (%)',
	},
];

const pageDescription = `A Systematic Withdrawal Plan (SWP) is a facility provided by mutual funds that allows investors to withdraw a fixed amount from their investment at regular intervals. SWP is a popular option for retirees who want to generate a regular income stream from their mutual fund investments. With our SWP calculator, you can estimate the amount you can withdraw regularly based on your investment amount, tenure, and expected returns.`;

export const Route = createFileRoute('/calculators/swp')({
	head: () => ({
		meta: [
			{ title: 'SWP Calculator' },
			{ name: 'description', content: pageDescription },
			{
				name: 'keywords',
				content:
					'SWP, Systematic Withdrawal Plan, Step Up, Mutual Funds, Investment, Financial Planning',
			},
		],
	}),
	component: Page,
});

function Page() {
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
