import { createFileRoute } from '@tanstack/react-router';
import ReturnsPage from '@/features/investment-analysis/components/returns-page';

export const Route = createFileRoute('/investment-analysis/cagr')({
	component: Page,
});

function Page() {
	return (
		<>
			<title>Indian Mutual Funds and Index CAGR Returns</title>
			<meta
				name='keywords'
				content='Mutual Funds, Stock Market Index, Nifty 50, Sensex, S&P 500, NASDAQ 100, Rolling Returns, CAGR, Investment Analysis, Financial Planning'
			/>
			<ReturnsPage
				returnType='cagr'
				title='CAGR'
				href='/investment-analysis/cagr'
				description='Analyze CAGR (Compound Annual Growth Rate) rolling returns of Indian Mutual Funds and global stock market indexes such as Nifty 50, Sensex, S&P 500 and NASDAQ 100. Compare long-term performance across different time frames, in your preferred currency, to make informed investment decisions.'
			/>
		</>
	);
}
