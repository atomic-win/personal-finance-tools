'use client';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	OverallPortfolio,
	InstrumentTypePortfolio,
	InstrumentPortfolio,
	AssetPortfolio,
	Asset,
	Instrument,
} from '@/features/investments/lib/types';
import withAssets from '@/features/investments/components/hoc/withAssets';
import withInstruments from '@/features/investments/components/hoc/withInstruments';
import { withOverallPortfolios } from '@/features/investments/components/hoc/withOverallPortfolios';
import { withInstrumentTypePortfolios } from '@/features/investments/components/hoc/withInstrumentTypePortfolios';
import { withInstrumentPortfolios } from '@/features/investments/components/hoc/withInstrumentPortfolios';
import { withAssetPortfolios } from '@/features/investments/components/hoc/withAssetPortfolios';
import withInvestmentsFilter from '@/features/investments/components/hoc/withInvestmentsFilter';
import withCurrency from '@/features/investments/components/hoc/withCurrency';

export default function withPortfolios(
	OverallSection: React.ComponentType<{
		portfolios: OverallPortfolio[];
	}>,
	InstrumentTypeSection: React.ComponentType<{
		portfolios: InstrumentTypePortfolio[];
	}>,
	InstrumentSection: React.ComponentType<{
		portfolios: InstrumentPortfolio[];
	}>,
	AssetSection: React.ComponentType<{
		portfolios: AssetPortfolio[];
		renderedFromPortfolioPage: boolean;
	}>
) {
	return function WithPortfolios({ latest }: { latest: boolean }) {
		const WithLoadedComponent = withAssets(
			withInstruments(withInvestmentsFilter(Page))
		);

		return (
			<WithLoadedComponent
				latest={latest}
				OverallSection={OverallSection}
				InstrumentTypeSection={InstrumentTypeSection}
				InstrumentSection={InstrumentSection}
				AssetSection={AssetSection}
			/>
		);
	};
}

function Page({
	assetIds,
	assets,
	instruments,
	latest,
	OverallSection,
	InstrumentTypeSection,
	InstrumentSection,
	AssetSection,
}: {
	assetIds: string[];
	assets: Asset[];
	instruments: Instrument[];
	latest: boolean;
	OverallSection: React.ComponentType<{
		portfolios: OverallPortfolio[];
	}>;
	InstrumentTypeSection: React.ComponentType<{
		portfolios: InstrumentTypePortfolio[];
	}>;
	InstrumentSection: React.ComponentType<{
		portfolios: InstrumentPortfolio[];
	}>;
	AssetSection: React.ComponentType<{
		portfolios: AssetPortfolio[];
		renderedFromPortfolioPage: boolean;
	}>;
}) {
	const WithLoadedOverallSection = withCurrency(
		withOverallPortfolios(OverallSection)
	);

	const WithLoadedInstrumentTypeSection = withCurrency(
		withInstrumentTypePortfolios(InstrumentTypeSection)
	);

	const WithLoadedInstrumentSection = withCurrency(
		withInstrumentPortfolios(InstrumentSection)
	);

	const WithLoadedAssetSection = withCurrency(
		withAssetPortfolios(AssetSection)
	);

	return (
		<>
			<PortfolioSectionCard
				title='Overall Portfolio'
				description='Overall stats for the portfolio'>
				<WithLoadedOverallSection assetIds={assetIds} latest={latest} />
			</PortfolioSectionCard>
			<PortfolioSectionCard
				title='Portfolio Per Instrument Type'
				description='Stats for each instrument type in the portfolio'>
				<WithLoadedInstrumentTypeSection assetIds={assetIds} latest={latest} />
			</PortfolioSectionCard>
			<PortfolioSectionCard
				title='Portfolio Per Instrument'
				description='Stats for each instrument in the portfolio'>
				<WithLoadedInstrumentSection
					assetIds={assetIds}
					instruments={instruments}
					latest={latest}
				/>
			</PortfolioSectionCard>
			<PortfolioSectionCard
				title='Portfolio Per Asset'
				description='Stats for each asset in the portfolio'>
				<WithLoadedAssetSection
					assetIds={assetIds}
					instruments={instruments}
					assets={assets}
					latest={latest}
					renderedFromPortfolioPage={true}
				/>
			</PortfolioSectionCard>
		</>
	);
}

function PortfolioSectionCard({
	title,
	description,
	children,
}: {
	title: string;
	description: string;
	children: React.ReactNode;
}) {
	return (
		<Card className='mx-auto my-2 p-2 rounded-lg shadow-md'>
			<CardHeader className='flex items-center gap-4 space-y-0 border-b py-2 pt-4 sm:flex-row'>
				<div className='grid text-center sm:text-left w-full gap-2'>
					<CardTitle>{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</div>
			</CardHeader>
			<CardContent className='p-4'>{children}</CardContent>
		</Card>
	);
}
