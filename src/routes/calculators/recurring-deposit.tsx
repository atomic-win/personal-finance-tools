import { createFileRoute } from '@tanstack/react-router';
import CalculatorPage from '@/features/calculators/components/CalculatorPage';
import RdCalculatorResult from '@/features/calculators/components/RdCalculatorResult';
import {
	type RdCalculator,
	RdCalculatorSchema,
} from '@/features/calculators/lib/types';

const formFields = [
	{
		name: 'monthlyDepositAmount',
		label: 'Monthly Deposit Amount',
	},
	{
		name: 'annualInterestRate',
		label: 'Annual Interest Rate (%)',
	},
	{
		name: 'numberOfYears',
		label: 'Time Period (Years)',
	},
];

const pageDescription = `The Recurring Deposit (RD) Interest Calculator helps you estimate the maturity amount and interest earned on your recurring deposit investments. Simply input the monthly deposit amount, annual interest rate, and time period to get the results.`;

export const Route = createFileRoute('/calculators/recurring-deposit')({
	head: () => ({
		meta: [
			{ title: 'RD Interest Calculator' },
			{ name: 'description', content: pageDescription },
			{
				name: 'keywords',
				content:
					'Recurring Deposit, RD, Interest Calculator, Investment, Financial Planning',
			},
		],
	}),
	component: Page,
});

function Page() {
	return (
		<CalculatorPage<RdCalculator>
			calculatorName='RD Interest'
			pageDescription={pageDescription}
			type='recurring-deposit'
			calculatorSchema={RdCalculatorSchema}
			formFields={formFields}
			CalculatorResult={RdCalculatorResult}
		/>
	);
}
