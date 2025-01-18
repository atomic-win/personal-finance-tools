'use client';
import withAssets from '@/features/investments/components/hoc/withAssets';
import withInstruments from '@/features/investments/components/hoc/withInstruments';
import withPortfolios from '@/features/investments/components/hoc/withPortfolios';
import InvestmentsFilterForm from '@/features/investments/components/InvestmentsFilterForm';
import {
	AssetPortfolio,
	InstrumentPortfolio,
	InstrumentTypePortfolio,
	OverallPortfolio,
} from '@/features/investments/lib/types';
import withPortfolioTrendsSection from '@/features/investments/components/hoc/withPortfolioTrendsSection';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';

export default function Page() {
	const PortfolioTrendsOverallSection =
		withPortfolioTrendsSection<OverallPortfolio>({
			labelFn: () => 'Overall',
		});

	const PortfolioTrendsPerInstrumentTypeSection =
		withPortfolioTrendsSection<InstrumentTypePortfolio>({
			labelFn: (portfolio) => portfolio.id,
		});

	const PortfolioTrendsPerInstrumentSection =
		withPortfolioTrendsSection<InstrumentPortfolio>({
			labelFn: (portfolio) => portfolio.instrumentName,
		});

	const PortfolioTrendsPerAssetSection =
		withPortfolioTrendsSection<AssetPortfolio>({
			labelFn: (portfolio) => portfolio.assetName,
		});

	const WithLoadedPortfolio = withPortfolios(
		PortfolioTrendsOverallSection,
		PortfolioTrendsPerInstrumentTypeSection,
		PortfolioTrendsPerInstrumentSection,
		PortfolioTrendsPerAssetSection
	);

	const WithLoadedInvestmentsFilterForm = withAssets(
		withInstruments(InvestmentsFilterForm)
	);

	return (
		<>
			<title>Portfolio Trends</title>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{ title: 'Investments', href: '#' },
					{ title: 'Portfolio Trends', href: '/investments/portfolio-trends' },
				]}
			/>
			<div className='container mx-auto p-2'>
				<div className='grid grid-cols-3 gap-4'>
					<div className='col-span-2'>
						<WithLoadedPortfolio latest={false} />
					</div>
					<div className='col-span-1'>
						<WithLoadedInvestmentsFilterForm />
					</div>
				</div>
			</div>
		</>
	);
}
