'use client';
import {
	RdCalculator,
	RdCalculatorSchema,
} from '@/features/calculators/lib/types';
import CalculatorPage from '@/features/calculators/components/CalculatorPage';
import RdCalculatorResult from '@/features/calculators/components/RdCalculatorResult';

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

export default function Page() {
	const pageDescription = `The Recurring Deposit (RD) Interest Calculator helps you estimate the maturity amount and interest earned on your recurring deposit investments. Simply input the monthly deposit amount, annual interest rate, and time period to get the results.`;

	return (
		<>
			<title>RD Interest Calculator</title>
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
