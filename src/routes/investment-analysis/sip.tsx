import { createFileRoute } from '@tanstack/react-router';
import ReturnsPage from '@/features/investment-analysis/components/returns-page';

export const Route = createFileRoute('/investment-analysis/sip')({
	component: Page,
});

function Page() {
	return (
		<>
			<title>Indian Mutual Funds and Index SIP Returns</title>
			<meta
				name='keywords'
				content='Mutual Funds, Stock Market Index, Nifty 50, Sensex, S&P 500, NASDAQ 100, Rolling Returns, SIP, Investment Analysis, Financial Planning'
			/>
			<ReturnsPage
				returnType='sip'
				title='SIP'
				href='/investment-analysis/sip'
				description='Analyze Systematic Investment Plan (SIP) returns of Indian Mutual Funds and global stock market indexes such as Nifty 50, Sensex, S&P 500 and NASDAQ 100. Compare long-term performance across different time frames, in your preferred currency, to make informed investment decisions.'
			/>
		</>
	);
}
