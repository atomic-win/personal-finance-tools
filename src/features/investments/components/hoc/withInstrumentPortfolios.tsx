import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';
import { Currency } from '@/lib/types';
import useValuationQueries from '@/features/investments/hooks/valuation';
import {
	InstrumentPortfolio,
	Instrument,
	Portfolio,
	Asset,
	PortfolioType,
	Transaction,
} from '@/features/investments/lib/types';
import {
	calculatePortfolios,
	findInstrumentById,
} from '@/features/investments/lib/utils';

export function withInstrumentPortfolios<
	T extends { portfolios: InstrumentPortfolio[] }
>(Component: React.ComponentType<T>) {
	return function WithInstrumentPortfolios(
		props: Omit<T, 'portfolios'> & {
			currency: Currency;
			assetIds: string[];
			assets: Asset[];
			instruments: Instrument[];
			transactions: Transaction[];
			latest: boolean;
		}
	) {
		const portfolioQueryResults = useValuationQueries(
			props.currency,
			props.assetIds,
			props.assets,
			props.instruments,
			props.transactions,
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
			calculatePortfolios(portfolioQueryResults.map((result) => result.data!)),
			props.instruments
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
	instruments: Instrument[]
): InstrumentPortfolio[] {
	return portfolios.map((portfolio) => {
		const instrument = findInstrumentById(instruments, portfolio.id)!;

		return {
			...portfolio,
			type: PortfolioType.PerInvestmentInstrument,
			instrumentName: instrument.name,
			instrumentType: instrument.type,
		};
	});
}
