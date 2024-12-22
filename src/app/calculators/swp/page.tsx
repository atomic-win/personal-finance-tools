'use client';
import SwpCalculatorCard from '@/features/calculators/components/SwpCalculatorCard';
import { SwpCalculator } from '@/features/calculators/lib/types';
import CalculatorPage from '@/features/calculators/components/CalculatorPage';

export default function Page() {
	const pageDescription = `A Systematic Withdrawal Plan (SWP) is a facility provided by mutual funds that allows investors to withdraw a fixed amount from their investment at regular intervals. SWP is a popular option for retirees who want to generate a regular income stream from their mutual fund investments. With our SWP calculator, you can estimate the amount you can withdraw regularly based on your investment amount, tenure, and expected returns.`;

	return (
		<CalculatorPage<SwpCalculator>
			pageTitle='SWP Calculator'
			pageDescription={pageDescription}
			type='swp'
			CalculatorCard={SwpCalculatorCard}
		/>
	);
}
