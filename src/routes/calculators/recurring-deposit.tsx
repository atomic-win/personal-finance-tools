import { createFileRoute } from '@tanstack/react-router';
import CalculatorPage from '@/features/calculators/components/calculator-page';
import RdCalculatorResult from '@/features/calculators/components/rd-calculator-result';
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
	component: Page,
});

function Page() {
	return (
		<>
			<title>RD Interest Calculator</title>
			<meta name='description' content={pageDescription} />
			<meta
				name='keywords'
				content='Recurring Deposit, RD, Interest Calculator, Investment, Financial Planning'
			/>
			<CalculatorPage<RdCalculator>
				calculatorName='RD Interest'
				pageDescription={pageDescription}
				type='recurring-deposit'
				calculatorSchema={RdCalculatorSchema}
				formFields={formFields}
				CalculatorResult={RdCalculatorResult}
			/>
		</>
	);
}
