'use client';
import {
	SipSwpCalculator,
	sipSwpCalculatorSchema,
} from '@/features/calculators/lib/types';
import SipSwpCalculatorResult from '@/features/calculators/components/SipSwpCalculatorResult';
import CalculatorCard from '@/features/calculators/components/CalculatorCard';

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
		name: 'monthlySwpWithdrawalAmount',
		label: 'Monthly SWP Withdrawal',
		description: 'Enter the monthly SWP withdrawal amount',
	},
	{
		name: 'annualInflationPercent',
		label: 'Annual Inflation Rate (%)',
		description: 'Enter the annual inflation rate',
	},
];

export default function SipSwpCalculatorCard({
	index,
	calculator,
}: {
	index: number;
	calculator: SipSwpCalculator;
}) {
	return (
		<CalculatorCard<SipSwpCalculator>
			index={index}
			calculator={calculator}
			formFields={formFields}
			calculatorSchema={sipSwpCalculatorSchema}
			calculatorName='SIP + SWP'
			type='sip-swp'
			CalculatorResult={SipSwpCalculatorResult}
		/>
	);
}
