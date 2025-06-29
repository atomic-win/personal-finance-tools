'use client';
import ReturnsPage from '@/features/returns/components/ReturnsPage';
import { InstrumentType } from '@/features/returns/lib/types';

export default function Page() {
	return (
		<ReturnsPage
			instrumentType={InstrumentType.MutualFund}
			returnType='cagr'
			htmlTitle='Indian Mutual Funds CAGR Analysis'
			keywords={[
				'Indian Mutual Funds',
				'CAGR Analysis',
				'Rolling Returns',
				'Investment Performance',
				'Long-term Returns',
				'Financial Analysis',
				'Investment Strategy',
				'Mutual Fund Comparison',
			]}
			breadcrumbs={[
				{ title: 'Indian Mutual Funds Analysis', href: '', disabled: true },
				{
					title: 'CAGR Returns',
					href: '/indian-mutual-funds-analysis/cagr',
					disabled: true,
				},
			]}
			pageTitle='Indian Mutual Funds Analysis'
			pageSubtitle='CAGR Returns'
			description='Analyze CAGR (Compound Annual Growth Rate) rolling returns of Indian
						Mutual Funds. Understand long-term fund performance across different
						time frames to make informed investment decisions. Discover trends,
						evaluate consistency, and compare funds to identify those that align
						with your financial goals.'
		/>
	);
}
