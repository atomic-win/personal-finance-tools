'use client';
import SipCalculatorCard from '@/features/calculators/components/SipCalculatorCard';
import { SipCalculator } from '@/features/calculators/lib/types';
import CalculatorPage from '@/features/calculators/components/CalculatorPage';

export default function Page() {
	const pageDescription = `A Systematic Investment Plan (SIP) is a facility provided by mutual funds that allows investors to invest a fixed amount in a mutual fund scheme at regular intervals. SIP is a popular option for investors who want to invest in mutual funds without worrying about market timing. With our SIP calculator, you can estimate the future value of your investment based on your investment amount, tenure, and expected returns.`;

	return (
		<CalculatorPage<SipCalculator>
			pageTitle='SIP Calculator'
			pageDescription={pageDescription}
			type='sip'
			CalculatorCard={SipCalculatorCard}
		/>
	);
}
