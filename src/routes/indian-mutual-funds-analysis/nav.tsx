import { createFileRoute } from '@tanstack/react-router';
import NavChartPage from '@/features/indian-mutual-funds-analysis/components/nav-page';

export const Route = createFileRoute('/indian-mutual-funds-analysis/nav')({
	component: Page,
});

function Page() {
	return (
		<>
			<title>Indian Mutual Funds NAV History</title>
			<meta
				name='keywords'
				content='Mutual Funds, NAV, Net Asset Value, NAV History, Investment Analysis'
			/>
			<NavChartPage />
		</>
	);
}
