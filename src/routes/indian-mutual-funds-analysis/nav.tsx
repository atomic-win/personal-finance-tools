import { createFileRoute } from '@tanstack/react-router';
import NavChartPage from '@/features/indian-mutual-funds-analysis/components/NavPage';

export const Route = createFileRoute('/indian-mutual-funds-analysis/nav')({
	head: () => ({
		meta: [
			{ title: 'Indian Mutual Funds NAV History' },
			{
				name: 'keywords',
				content:
					'Mutual Funds, NAV, Net Asset Value, NAV History, Investment Analysis',
			},
		],
	}),
	component: Page,
});

function Page() {
	return <NavChartPage />;
}
