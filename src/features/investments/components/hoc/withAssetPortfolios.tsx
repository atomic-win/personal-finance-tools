import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';
import { Currency } from '@/lib/types';
import usePortfoliosQuery from '@/features/investments/hooks/portfolios';
import {
	AssetPortfolio,
	Asset,
	Instrument,
	PortfolioType,
	Portfolio,
} from '@/features/investments/lib/types';
import {
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
		const {
			data: portfolios,
			isFetching,
			error: portfoliosError,
		} = usePortfoliosQuery(
			props.currency,
			props.assetIds.length > 0
				? props.assetIds
				: props.assets.map((asset) => asset.id),
			PortfolioType.PerAsset,
			props.latest
		);

		if (isFetching) {
			return <LoadingComponent loadingMessage='Fetching portfolios' />;
		}

		if (portfoliosError || !portfolios) {
			return <ErrorComponent errorMessage='Failed while fetching portfolios' />;
		}

		const assetPortolios = calculateAssetPortfolios(
			portfolios,
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
