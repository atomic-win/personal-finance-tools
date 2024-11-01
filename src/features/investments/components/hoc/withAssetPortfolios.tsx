import { Currency } from '@/lib/types';
import {
	AssetPortfolio,
	Asset,
	Instrument,
	Portfolio,
	PortfolioType,
	Transaction,
} from '@/features/investments/lib/types';
import {
	findAssetById,
	findInstrumentById,
} from '@/features/investments/lib/utils';
import { withValuations } from '@/features/investments/components/hoc/withValuations';

export function withAssetPortfolios<
	T extends {
		portfolios: AssetPortfolio[];
	}
>(Component: React.ComponentType<T>) {
	return function WithAssetPortfolios(
		props: Omit<T, 'portfolios'> & {
			currency: Currency;
			assetIds: string[];
			assets: Asset[];
			instruments: Instrument[];
			transactions: Transaction[];
			latest: boolean;
		}
	) {
		const WithLoadedValuationsComponent = withValuations(Component);

		return (
			<WithLoadedValuationsComponent
				{...(props as unknown as T)}
				currency={props.currency}
				assetIds={
					props.assetIds.length > 0
						? props.assetIds
						: props.assets.map((asset) => asset.id)
				}
				assets={props.assets}
				instruments={props.instruments}
				transactions={props.transactions}
				idSelector={(asset) => asset.id}
				portfolioFn={calculateAssetPortfolio}
				latest={props.latest}
			/>
		);
	};
}

function calculateAssetPortfolio(
	assets: Asset[],
	instruments: Instrument[],
	portfolio: Portfolio
): AssetPortfolio {
	const asset = findAssetById(assets, portfolio.id)!;
	const instrument = findInstrumentById(instruments, asset.instrumentId)!;

	return {
		...portfolio,
		type: PortfolioType.PerAsset,
		assetName: asset.name,
		instrumentId: asset.instrumentId,
		instrumentType: instrument.type,
		instrumentName: instrument.name,
	};
}
