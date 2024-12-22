'use client';
import SipSwpCalculatorCard from '@/features/calculators/components/SipSwpCalculatorCard';
import { SipSwpCalculator } from '@/features/calculators/lib/types';
import CalculatorPage from '@/features/calculators/components/CalculatorPage';

export default function Page() {
	const pageDescription = `The SIP + SWP Calculator helps you plan your investments and withdrawals. Systematic Investment Plan (SIP) allows you to invest a fixed amount regularly, while Systematic Withdrawal Plan (SWP) enables you to withdraw a fixed amount periodically. Use this tool to simulate and manage your financial goals effectively.`;

	return (
		<CalculatorPage<SipSwpCalculator>
			pageTitle='SIP + SWP Calculator'
			pageDescription={pageDescription}
			type='sip-swp'
			CalculatorCard={SipSwpCalculatorCard}
		/>
	);
}
