import { createFileRoute } from '@tanstack/react-router';
import ScheduleFAPage from '@/features/schedule-fa/components/schedule-fa-page';

export const Route = createFileRoute('/itr/schedule-fa/a3')({
	component: Page,
});

function Page() {
	return (
		<>
			<title>Schedule FA — Table A3</title>
			<meta
				name='description'
				content='Generate Schedule FA Table A3 (Foreign Equity & Debt Interest) for Indian ITR filing. Auto-fetches stock prices, dividends, and exchange rates.'
			/>
			<meta
				name='keywords'
				content='Schedule FA, ITR, Foreign Assets, Foreign Stocks, Table A3, Income Tax, India'
			/>
			<ScheduleFAPage />
		</>
	);
}
