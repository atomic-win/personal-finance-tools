'use client';
import {
	SipCalculator,
	sipCalculatorSchema,
} from '@/features/calculators/lib/types';
import CalculatorPage from '@/features/calculators/components/CalculatorPage';
import SipCalculatorResult from '@/features/calculators/components/SipCalculatorResult';

const formFields = [
	{
		name: 'lumpsumAmount',
		label: 'Initial Lumpsum Amount',
	},
	{
		name: 'monthlyInvestmentAmount',
		label: 'Monthly SIP Investment Amount',
	},
	{
		name: 'annualInterestPercent',
		label: 'Annual Interest Rate (%)',
	},
	{
		name: 'annualStepUpPercent',
		label: 'Annual Step-Up (%)',
	},
	{
		name: 'numberOfYears',
		label: 'Investment Duration (Years)',
	},
];

export default function Page() {
	const pageDescription = `A Systematic Investment Plan (SIP) is a facility provided by mutual funds that allows investors to invest a fixed amount in a mutual fund scheme at regular intervals. SIP is a popular option for investors who want to invest in mutual funds without worrying about market timing. With our SIP calculator, you can estimate the future value of your investment based on your investment amount, tenure, and expected returns.`;

	return (
		<>
			<title>SIP Calculator</title>
			<CalculatorPage<SipCalculator>
				calculatorName='SIP'
				pageDescription={pageDescription}
				type='sip'
				calculatorSchema={sipCalculatorSchema}
				formFields={formFields}
				CalculatorResult={SipCalculatorResult}
			/>
		</>
	);
}
