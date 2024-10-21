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
	PortfolioType,
} from '@/features/investments/lib/types';
import withAssets from '@/features/investments/components/hoc/withAssets';
import withInstruments from '@/features/investments/components/hoc/withInstruments';
import { withOverallPortfolios } from '@/features/investments/components/hoc/withOverallPortfolios';
import { withInstrumentTypePortfolios } from '@/features/investments/components/hoc/withInstrumentTypePortfolios';
import { withInstrumentPortfolios } from '@/features/investments/components/hoc/withInstrumentPortfolios';
import { withAssetPortfolios } from '@/features/investments/components/hoc/withAssetPortfolios';
import withInvestmentsFilter from '@/features/investments/components/hoc/withInvestmentsFilter';
import withCurrency from '@/features/investments/components/hoc/withCurrency';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

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
		<Card className='mx-auto my-2 p-2 rounded-lg shadow-md'>
			<CardContent className='p-4'>
				<Tabs defaultValue={PortfolioType.Overall}>
					<TabsList className='grid w-full grid-cols-4'>
						<TabsTrigger value={PortfolioType.Overall}>Overall</TabsTrigger>
						<TabsTrigger value={PortfolioType.PerInvestmentInstrumentType}>
							Per Instrument Type
						</TabsTrigger>
						<TabsTrigger value={PortfolioType.PerInvestmentInstrument}>
							Per Instrument
						</TabsTrigger>
						<TabsTrigger value={PortfolioType.PerAsset}>Per Asset</TabsTrigger>
					</TabsList>
					<PortfolioTabsContent
						portfolioType={PortfolioType.Overall}
						title='Overall Portfolio'
						description='Overall stats for the portfolio'>
						<WithLoadedOverallSection assetIds={assetIds} latest={latest} />
					</PortfolioTabsContent>
					<PortfolioTabsContent
						portfolioType={PortfolioType.PerInvestmentInstrumentType}
						title='Portfolio Per Instrument Type'
						description='Stats for each instrument type in the portfolio'>
						<WithLoadedInstrumentTypeSection
							assetIds={assetIds}
							latest={latest}
						/>
					</PortfolioTabsContent>
					<PortfolioTabsContent
						portfolioType={PortfolioType.PerInvestmentInstrument}
						title='Portfolio Per Instrument'
						description='Stats for each instrument in the portfolio'>
						<WithLoadedInstrumentSection
							assetIds={assetIds}
							instruments={instruments}
							latest={latest}
						/>
					</PortfolioTabsContent>
					<PortfolioTabsContent
						portfolioType={PortfolioType.PerAsset}
						title='Portfolio Per Asset'
						description='Stats for each asset in the portfolio'>
						<WithLoadedAssetSection
							assetIds={assetIds}
							instruments={instruments}
							assets={assets}
							latest={latest}
							renderedFromPortfolioPage={true}
						/>
					</PortfolioTabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}

function PortfolioTabsContent({
	portfolioType,
	title,
	description,
	children,
}: {
	portfolioType: PortfolioType;
	title: string;
	description: string;
	children: React.ReactNode;
}) {
	return (
		<TabsContent value={portfolioType}>
			<CardHeader className='flex items-center gap-4 space-y-0 border-b py-2 pt-4 sm:flex-row'>
				<div className='grid text-center sm:text-left w-full gap-2'>
					<CardTitle>{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</div>
			</CardHeader>
			<CardContent className='p-4'>{children}</CardContent>
		</TabsContent>
	);
}
