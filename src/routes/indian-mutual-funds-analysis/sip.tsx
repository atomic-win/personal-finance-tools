import { createFileRoute } from '@tanstack/react-router';
import ReturnsPage from '@/features/indian-mutual-funds-analysis/components/ReturnsPage';

export const Route = createFileRoute('/indian-mutual-funds-analysis/sip')({
	head: () => ({
		meta: [
			{ title: 'Indian Mutual Funds SIP Returns' },
			{
				name: 'keywords',
				content:
					'Mutual Funds, Rolling Returns, SIP, Investment Analysis, Financial Planning',
			},
		],
	}),
	component: Page,
});

function Page() {
	return (
		<ReturnsPage
			returnType='sip'
			title='SIP'
			href='/indian-mutual-funds-analysis/sip'
			description='Analyze Systematic Investment Plan (SIP) returns of Indian Mutual Funds. Understand long-term fund performance across different time frames to make informed investment decisions. Discover trends, evaluate consistency, and compare funds to identify those that align with your financial goals.'
		/>
	);
}
