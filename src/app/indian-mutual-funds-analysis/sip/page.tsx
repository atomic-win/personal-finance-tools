'use client';
import ReturnsPage from '@/features/returns/components/ReturnsPage';
import { InstrumentType } from '@/features/returns/lib/types';

export default function Page() {
	return (
		<ReturnsPage
			instrumentType={InstrumentType.MutualFund}
			returnType='sip'
			htmlTitle='Indian Mutual Funds SIP Analysis'
			keywords={[
				'Indian Mutual Funds',
				'SIP Analysis',
				'Systematic Investment Plan',
				'Investment Performance',
				'Long-term Returns',
				'Financial Analysis',
				'Investment Strategy',
				'Mutual Fund Comparison',
			]}
			breadcrumbs={[
				{ title: 'Indian Mutual Funds Analysis', href: '', disabled: true },
				{
					title: 'SIP Returns',
					href: '/indian-mutual-funds-analysis/sip',
					disabled: true,
				},
			]}
			pageTitle='Indian Mutual Funds Analysis'
			pageSubtitle='SIP Returns'
			description='Analyze Systematic Investment Plan (SIP) returns of Indian Mutual Funds. Understand long-term fund performance across different time frames to make informed investment decisions. Discover trends, evaluate consistency, and compare funds to identify those that align with your financial goals.'
		/>
	);
}
