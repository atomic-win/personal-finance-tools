import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';
import { Currency } from '@/lib/types';
import usePortfolioQueries from '@/features/investments/hooks/portfolios';
import {
	AssetPortfolio,
	Asset,
	Instrument,
	Portfolio,
} from '@/features/investments/lib/types';
import {
	calculatePortfolios,
	findAssetById,
	findInstrumentById,
} from '@/features/investments/lib/utils';

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
			latest: boolean;
		}
	) {
		const portfolioQueryResults = usePortfolioQueries(
			props.currency,
			props.assetIds.length > 0
				? props.assetIds
				: props.assets.map((asset) => asset.id),
			props.assets,
			props.instruments,
			(asset) => asset.id,
			props.latest
		);

		if (portfolioQueryResults.some((result) => result.isFetching)) {
			return <LoadingComponent loadingMessage='Fetching portfolios' />;
		}

		if (portfolioQueryResults.some((result) => result.isError)) {
			return <ErrorComponent errorMessage='Failed while fetching portfolios' />;
		}

		const assetPortolios = calculateAssetPortfolios(
			calculatePortfolios(portfolioQueryResults.map((result) => result.data!)),
			props.assets,
			props.instruments,
			props.currency
		);

		return (
			<Component {...(props as unknown as T)} portfolios={assetPortolios} />
		);
	};
}

function calculateAssetPortfolios(
	portfolios: Portfolio[],
	assets: Asset[],
	instruments: Instrument[],
	currency: Currency
): AssetPortfolio[] {
	return portfolios.map((portfolio) => {
		const asset = findAssetById(assets, portfolio.id)!;
		const instrument = findInstrumentById(instruments, asset.instrumentId)!;

		return {
			...portfolio,
			assetName: asset.name,
			instrumentId: asset.instrumentId,
			instrumentType: instrument.type,
			instrumentName: instrument.name,
			currency: currency,
		};
	});
}
