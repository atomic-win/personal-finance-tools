import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';
import { Currency } from '@/lib/types';
import usePortfoliosQuery from '@/features/investments/hooks/portfolios';
import {
	InstrumentTypePortfolio,
	PortfolioType,
	Portfolio,
} from '@/features/investments/lib/types';

export function withInstrumentTypePortfolios<
	T extends { portfolios: InstrumentTypePortfolio[] }
>(Component: React.ComponentType<T>) {
	return function WithInstrumentTypePortfolios(
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
			PortfolioType.PerInvestmentInstrumentType,
			props.latest
		);

		if (isFetching) {
			return <LoadingComponent loadingMessage='Fetching portfolios' />;
		}

		if (portfoliosError || !portfolios) {
			return <ErrorComponent errorMessage='Failed while fetching portfolios' />;
		}

		const instrumentTypePortfolios = calculateInstrumentTypePortfolios(
			portfolios,
			props.currency
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
	portfolios: Portfolio[],
	currency: Currency
): InstrumentTypePortfolio[] {
	return portfolios.map((portfolio) => {
		return {
			...portfolio,
			currency: currency,
		};
	});
}
