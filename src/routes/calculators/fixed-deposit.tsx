import { createFileRoute } from '@tanstack/react-router';
import CalculatorPage from '@/features/calculators/components/calculator-page';
import FdCalculatorResult from '@/features/calculators/components/fd-calculator-result';
import {
	type FdCalculator,
	FdCalculatorSchema,
} from '@/features/calculators/lib/types';

const formFields = [
	{
		name: 'principalAmount',
		label: 'Principal Amount',
	},
	{
		name: 'annualInterestRate',
		label: 'Annual Interest Rate (%)',
	},
	{
		name: 'numberOfYears',
		label: 'Time Period (Years)',
	},
	{
		name: 'compoundingFrequency',
		label: 'Compounding Frequency (Times per Year)',
	},
];

const pageDescription = `The Fixed Deposit (FD) Interest Calculator helps you estimate the maturity amount and interest earned on your fixed deposit investments. Simply input the principal amount, annual interest rate, time period, and compounding frequency to get the results.`;

export const Route = createFileRoute('/calculators/fixed-deposit')({
	component: Page,
});

function Page() {
	return (
		<>
			<title>FD Interest Calculator</title>
			<meta name='description' content={pageDescription} />
			<meta
				name='keywords'
				content='Fixed Deposit, FD, Interest Calculator, Investment, Financial Planning'
			/>
			<CalculatorPage<FdCalculator>
				calculatorName='FD Interest'
				pageDescription={pageDescription}
				type='fixed-deposit'
				calculatorSchema={FdCalculatorSchema}
				formFields={formFields}
				CalculatorResult={FdCalculatorResult}
			/>
		</>
	);
}
