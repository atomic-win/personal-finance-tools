import { createFileRoute } from '@tanstack/react-router';
import ReturnsPage from '@/features/indian-mutual-funds-analysis/components/ReturnsPage';

export const Route = createFileRoute('/indian-mutual-funds-analysis/cagr')({
	head: () => ({
		meta: [
			{ title: 'Indian Mutual Funds CAGR Returns' },
			{
				name: 'keywords',
				content:
					'Mutual Funds, Rolling Returns, CAGR, Investment Analysis, Financial Planning',
			},
		],
	}),
	component: Page,
});

function Page() {
	return (
		<ReturnsPage
			returnType='cagr'
			title='CAGR'
			href='/indian-mutual-funds-analysis/cagr'
			description='Analyze CAGR (Compound Annual Growth Rate) rolling returns of Indian
						Mutual Funds. Understand long-term fund performance across different
						time frames to make informed investment decisions. Discover trends,
						evaluate consistency, and compare funds to identify those that align
						with your financial goals.'
		/>
	);
}
