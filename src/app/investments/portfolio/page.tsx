'use client';
import withPortfolios from '@/features/investments/components/hoc/withPortfolios';
import PortfolioOverallSection from '@/features/investments/components/PortfolioOverallSection';
import PortfolioPerAssetSection from '@/features/investments/components/PortfolioPerAssetSection';
import PortfolioPerInstrumentSection from '@/features/investments/components/PortfolioPerInstrumentSection';
import PortfolioPerInstrumentTypeSection from '@/features/investments/components/PortfolioPerInstrumentTypeSection';

export default function Page() {
	const WithLoadedComponent = withPortfolios(
		PortfolioOverallSection,
		PortfolioPerInstrumentTypeSection,
		PortfolioPerInstrumentSection,
		PortfolioPerAssetSection
	);

	return (
		<div className='container mx-auto p-2'>
			<h1 className='text-2xl font-bold mb-4'>Portfolio</h1>
			<div className='grid grid-cols-3 gap-4'>
				<div className='col-span-2'>
					<WithLoadedComponent latest={true} />
				</div>
			</div>
		</div>
	);
}
