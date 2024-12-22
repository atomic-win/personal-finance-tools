'use client';
import {
	SipCalculator,
	sipCalculatorSchema,
} from '@/features/calculators/lib/types';
import SipCalculatorResult from '@/features/calculators/components/SipCalculatorResult';
import CalculatorCard from '@/features/calculators/components/CalculatorCard';

const formFields = [
	{
		name: 'lumpsumAmount',
		label: 'Lumpsum Amount',
		description: 'Enter the lumpsum amount',
	},
	{
		name: 'monthlyInvestmentAmount',
		label: 'Monthly Installment',
		description: 'Enter the monthly installment',
	},
	{
		name: 'annualInterestPercent',
		label: 'Annual Interest Rate (%)',
		description: 'Enter the annual interest rate',
	},
	{
		name: 'annualStepUpPercent',
		label: 'Annual Step-Up (%)',
		description: 'Enter the annual step-up percentage',
	},
	{
		name: 'numberOfYears',
		label: 'Investment Duration (Years)',
		description: 'Enter the investment duration in years',
	},
];

export default function SipCalculatorCard({
	index,
	calculator,
}: {
	index: number;
	calculator: SipCalculator;
}) {
	return (
		<CalculatorCard<SipCalculator>
			index={index}
			calculator={calculator}
			formFields={formFields}
			calculatorSchema={sipCalculatorSchema}
			calculatorName='SIP'
			type='sip'
			CalculatorResult={SipCalculatorResult}
		/>
	);
}
