import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';
import { Currency } from '@/lib/types';
import usePortfoliosQuery from '@/features/investments/hooks/portfolios';
import {
	InstrumentPortfolio,
	Instrument,
	PortfolioType,
	Portfolio,
} from '@/features/investments/lib/types';
import { findInstrumentById } from '@/features/investments/lib/utils';

export function withInstrumentPortfolios<
	T extends { portfolios: InstrumentPortfolio[] }
>(Component: React.ComponentType<T>) {
	return function WithInstrumentPortfolios(
		props: Omit<T, 'portfolios'> & {
			currency: Currency;
			assetIds: string[];
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
			props.assetIds,
			PortfolioType.PerInvestmentInstrument,
			props.latest
		);

		if (isFetching) {
			return <LoadingComponent loadingMessage='Fetching portfolios' />;
		}

		if (portfoliosError || !portfolios) {
			return <ErrorComponent errorMessage='Failed while fetching portfolios' />;
		}

		const instrumentPortfolios = calculateInstrumentPortfolios(
			portfolios,
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
