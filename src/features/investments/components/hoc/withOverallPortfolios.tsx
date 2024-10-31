import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';
import { Currency } from '@/lib/types';
import usePortfolioQueries from '@/features/investments/hooks/portfolios';
import {
	OverallPortfolio,
	Portfolio,
	Instrument,
	Asset,
	PortfolioType,
} from '@/features/investments/lib/types';
import { calculatePortfolios } from '@/features/investments/lib/utils';

export function withOverallPortfolios<
	T extends { portfolios: OverallPortfolio[] }
>(Component: React.ComponentType<T>) {
	return function WithOverallPortfolios(
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
			() => 'overall',
			props.latest
		);

		if (portfolioQueryResults.some((result) => result.isFetching)) {
			return <LoadingComponent loadingMessage='Fetching portfolios' />;
		}

		if (portfolioQueryResults.some((result) => result.isError)) {
			return <ErrorComponent errorMessage='Failed while fetching portfolios' />;
		}

		const overallPortfolios = calculateOverallPortfolios(
			calculatePortfolios(portfolioQueryResults.map((result) => result.data!))
		);

		return (
			<Component {...(props as unknown as T)} portfolios={overallPortfolios} />
		);
	};
}

function calculateOverallPortfolios(
	portfolios: Portfolio[]
): OverallPortfolio[] {
	return portfolios.map((portfolio) => {
		return {
			...portfolio,
			type: PortfolioType.Overall,
		};
	});
}
