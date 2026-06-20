import { createFileRoute } from '@tanstack/react-router';
import ReturnsPage from '@/features/indian-mutual-funds-analysis/components/returns-page';

export const Route = createFileRoute('/indian-mutual-funds-analysis/swp')({
	component: Page,
});

function Page() {
	return (
		<>
			<title>Indian Mutual Funds SWP Returns</title>
			<meta
				name='keywords'
				content='Mutual Funds, Rolling Returns, SWP, Investment Analysis, Financial Planning'
			/>
			<ReturnsPage
				returnType='swp'
				title='SWP'
				href='/indian-mutual-funds-analysis/swp'
				description='Analyze Systematic Withdrawal Plan (SWP) returns of Indian Mutual Funds. Understand long-term fund performance across different time frames to make informed investment decisions. Discover trends, evaluate consistency, and compare funds to identify those that align with your financial goals.'
			/>
		</>
	);
}
