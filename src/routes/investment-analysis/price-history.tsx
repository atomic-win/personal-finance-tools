import { createFileRoute } from '@tanstack/react-router';
import PriceHistoryPage from '@/features/investment-analysis/components/price-history-page';

export const Route = createFileRoute('/investment-analysis/price-history')({
	component: Page,
});

function Page() {
	return (
		<>
			<title>Mutual Funds NAV and Index Price History</title>
			<meta
				name='keywords'
				content='Mutual Funds, NAV, Net Asset Value, Stock Market Index, Nifty 50, Sensex, S&P 500, NASDAQ 100, Price History, Investment Analysis'
			/>
			<PriceHistoryPage />
		</>
	);
}
