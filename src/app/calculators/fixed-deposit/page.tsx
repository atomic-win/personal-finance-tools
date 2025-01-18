'use client';
import {
	FdCalculator,
	FdCalculatorSchema,
} from '@/features/calculators/lib/types';
import CalculatorPage from '@/features/calculators/components/CalculatorPage';
import FdCalculatorResult from '@/features/calculators/components/FdCalculatorResult';

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

export default function Page() {
	const pageDescription = `The Fixed Deposit (FD) Interest Calculator helps you estimate the maturity amount and interest earned on your fixed deposit investments. Simply input the principal amount, annual interest rate, time period, and compounding frequency to get the results.`;

	return (
		<>
			<title>FD Interest Calculator</title>
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
