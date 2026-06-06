import { createFileRoute } from '@tanstack/react-router';
import CalculatorPage from '@/features/calculators/components/CalculatorPage';
import SipCalculatorResult from '@/features/calculators/components/SipCalculatorResult';
import {
	type SipCalculator,
	sipCalculatorSchema,
} from '@/features/calculators/lib/types';

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

const pageDescription = `A Systematic Investment Plan (SIP) is a facility provided by mutual funds that allows investors to invest a fixed amount in a mutual fund scheme at regular intervals. SIP is a popular option for investors who want to invest in mutual funds without worrying about market timing. With our SIP calculator, you can estimate the future value of your investment based on your investment amount, tenure, and expected returns.`;

export const Route = createFileRoute('/calculators/sip')({
	head: () => ({
		meta: [
			{ title: 'SIP Calculator' },
			{ name: 'description', content: pageDescription },
			{
				name: 'keywords',
				content:
					'SIP, Systematic Investment Plan, Step Up, Mutual Funds, Investment, Financial Planning',
			},
		],
	}),
	component: Page,
});

function Page() {
	return (
		<CalculatorPage<SipCalculator>
			calculatorName='SIP'
			pageDescription={pageDescription}
			type='sip'
			calculatorSchema={sipCalculatorSchema}
			formFields={formFields}
			CalculatorResult={SipCalculatorResult}
		/>
	);
}
