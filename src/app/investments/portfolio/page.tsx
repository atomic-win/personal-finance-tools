'use client';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import withAssets from '@/features/investments/components/hoc/withAssets';
import withInstruments from '@/features/investments/components/hoc/withInstruments';
import withPortfolios from '@/features/investments/components/hoc/withPortfolios';
import InvestmentsFilterForm from '@/features/investments/components/InvestmentsFilterForm';
import PortfolioOverallSection from '@/features/investments/components/PortfolioOverallSection';
import PortfolioPerAssetSection from '@/features/investments/components/PortfolioPerAssetSection';
import PortfolioPerInstrumentSection from '@/features/investments/components/PortfolioPerInstrumentSection';
import PortfolioPerInstrumentTypeSection from '@/features/investments/components/PortfolioPerInstrumentTypeSection';

export default function Page() {
	const WithLoadedPortfolio = withPortfolios(
		PortfolioOverallSection,
		PortfolioPerInstrumentTypeSection,
		PortfolioPerInstrumentSection,
		PortfolioPerAssetSection
	);

	const WithLoadedInvestmentsFilterForm = withAssets(
		withInstruments(InvestmentsFilterForm)
	);

	return (
		<>
			 <title>Portfolio</title>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{ title: 'Investments', href: '#' },
					{ title: 'Portfolio', href: '/investments/portfolio' },
				]}
			/>
			<div className='container mx-auto p-2'>
				<div className='grid grid-cols-3 gap-4'>
					<div className='col-span-2'>
						<WithLoadedPortfolio latest={true} />
					</div>
					<div className='col-span-1'>
						<WithLoadedInvestmentsFilterForm />
					</div>
				</div>
			</div>
		</>
	);
}
