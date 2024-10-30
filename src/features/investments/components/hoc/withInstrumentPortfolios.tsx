import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';
import { Currency } from '@/lib/types';
import usePortfolioQueries from '@/features/investments/hooks/portfolios';
import {
	InstrumentPortfolio,
	Instrument,
	Portfolio,
	Asset,
} from '@/features/investments/lib/types';
import { findInstrumentById } from '@/features/investments/lib/utils';

export function withInstrumentPortfolios<
	T extends { portfolios: InstrumentPortfolio[] }
>(Component: React.ComponentType<T>) {
	return function WithInstrumentPortfolios(
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
			props.assetIds,
			props.assets,
			props.instruments,
			(_asset, instrument) => instrument.id,
			props.latest
		);

		if (portfolioQueryResults.some((result) => result.isFetching)) {
			return <LoadingComponent loadingMessage='Fetching portfolios' />;
		}

		if (portfolioQueryResults.some((result) => result.isError)) {
			return <ErrorComponent errorMessage='Failed while fetching portfolios' />;
		}

		const instrumentPortfolios = calculateInstrumentPortfolios(
			portfolioQueryResults.map((result) => result.data!),
			props.instruments,
			props.currency
		);

		return (
			<Component
				{...(props as unknown as T)}
				portfolios={instrumentPortfolios}
			/>
		);
	};
}

function calculateInstrumentPortfolios(
	portfolios: Portfolio[],
	instruments: Instrument[],
	currency: Currency
): InstrumentPortfolio[] {
	return portfolios.map((portfolio) => {
		const instrument = findInstrumentById(instruments, portfolio.id)!;

		return {
			...portfolio,
			instrumentName: instrument.name,
			instrumentType: instrument.type,
			currency: currency,
		};
	});
}
