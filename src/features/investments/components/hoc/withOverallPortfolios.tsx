import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';
import { Currency } from '@/lib/types';
import usePortfoliosQuery from '@/features/investments/hooks/portfolios';
import {
	OverallPortfolio,
	PortfolioType,
	Portfolio,
} from '@/features/investments/lib/types';

export function withOverallPortfolios<
	T extends { portfolios: OverallPortfolio[] }
>(Component: React.ComponentType<T>) {
	return function WithOverallPortfolios(
		props: Omit<T, 'portfolios'> & {
			currency: Currency;
			assetIds: string[];
			latest: boolean;
		}
	) {
		const {
			data: portfolios,
			isFetching,
			error: portfoliosError,
		} = usePortfoliosQuery(
			props.currency,
			props.assetIds,
			PortfolioType.Overall,
			props.latest
		);

		if (isFetching) {
			return <LoadingComponent loadingMessage='Fetching portfolios' />;
		}

		if (portfoliosError || !portfolios) {
			return <ErrorComponent errorMessage='Failed while fetching portfolios' />;
		}

		const overallPortfolios = calculateOverallPortfolios(
			portfolios,
			props.currency
		);

		return (
			<Component {...(props as unknown as T)} portfolios={overallPortfolios} />
		);
	};
}

function calculateOverallPortfolios(
	portfolios: Portfolio[],
	currency: Currency
): OverallPortfolio[] {
	return portfolios.map((portfolio) => {
		return {
			...portfolio,
			currency: currency,
		};
	});
}
