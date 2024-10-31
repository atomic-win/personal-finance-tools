import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';
import { Currency } from '@/lib/types';
import usePortfolioQueries from '@/features/investments/hooks/portfolios';
import {
	InstrumentTypePortfolio,
	Portfolio,
	Instrument,
	Asset,
	PortfolioType,
	Transaction,
} from '@/features/investments/lib/types';
import { calculatePortfolios } from '@/features/investments/lib/utils';

export function withInstrumentTypePortfolios<
	T extends { portfolios: InstrumentTypePortfolio[] }
>(Component: React.ComponentType<T>) {
	return function WithInstrumentTypePortfolios(
		props: Omit<T, 'portfolios'> & {
			currency: Currency;
			assetIds: string[];
			assets: Asset[];
			instruments: Instrument[];
			transactions: Transaction[];
			latest: boolean;
		}
	) {
		const portfolioQueryResults = usePortfolioQueries(
			props.currency,
			props.assetIds,
			props.assets,
			props.instruments,
			props.transactions,
			(_asset, instrument) => instrument.type,
			props.latest
		);

		if (portfolioQueryResults.some((result) => result.isFetching)) {
			return <LoadingComponent loadingMessage='Fetching portfolios' />;
		}

		if (portfolioQueryResults.some((result) => result.isError)) {
			return <ErrorComponent errorMessage='Failed while fetching portfolios' />;
		}

		const instrumentTypePortfolios = calculateInstrumentTypePortfolios(
			calculatePortfolios(portfolioQueryResults.map((result) => result.data!))
		);

		return (
			<Component
				{...(props as unknown as T)}
				portfolios={instrumentTypePortfolios}
			/>
		);
	};
}

function calculateInstrumentTypePortfolios(
	portfolios: Portfolio[]
): InstrumentTypePortfolio[] {
	return portfolios.map((portfolio) => {
		return {
			...portfolio,
			type: PortfolioType.PerInvestmentInstrumentType,
		};
	});
}
