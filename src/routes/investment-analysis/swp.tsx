import { createFileRoute } from '@tanstack/react-router';
import ReturnsPage from '@/features/investment-analysis/components/returns-page';

export const Route = createFileRoute('/investment-analysis/swp')({
	component: Page,
});

function Page() {
	return (
		<>
			<title>Indian Mutual Funds and Index SWP Returns</title>
			<meta
				name='keywords'
				content='Mutual Funds, Stock Market Index, NASDAQ 100, S&P 500, Rolling Returns, SWP, Investment Analysis, Financial Planning'
			/>
			<ReturnsPage
				returnType='swp'
				title='SWP'
				href='/investment-analysis/swp'
				description='Analyze Systematic Withdrawal Plan (SWP) returns of Indian Mutual Funds and global stock market indexes such as NASDAQ 100 and S&P 500. Compare long-term performance across different time frames, in your preferred currency, to make informed investment decisions.'
			/>
		</>
	);
}
