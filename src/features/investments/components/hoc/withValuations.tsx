import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';
import { Currency } from '@/lib/types';
import useValuationQueries from '@/features/investments/hooks/valuation';
import {
	Asset,
	Instrument,
	Portfolio,
	PortfolioType,
	Transaction,
	Valuation,
} from '@/features/investments/lib/types';

export function withValuations<
	TPortfolio extends Portfolio,
	T extends {
		portfolios: TPortfolio[];
	}
>(Component: React.ComponentType<T>) {
	return function WithValuations(
		props: Omit<T, 'portfolios'> & {
			currency: Currency;
			assetIds: string[];
			assets: Asset[];
			instruments: Instrument[];
			transactions: Transaction[];
			idSelector: (asset: Asset, instrument: Instrument) => string;
			portfolioFn: (
				assets: Asset[],
				instruments: Instrument[],
				portfolio: Portfolio
			) => TPortfolio;
			latest: boolean;
		}
	) {
		const valuationQueryResults = useValuationQueries(
			props.currency,
			props.assetIds.length > 0
				? props.assetIds
				: props.assets.map((asset) => asset.id),
			props.assets,
			props.instruments,
			props.transactions,
			props.idSelector,
			props.latest
		);

		if (valuationQueryResults.some((result) => result.isFetching)) {
			return <LoadingComponent loadingMessage='Fetching valuations' />;
		}

		if (valuationQueryResults.some((result) => result.isError)) {
			return <ErrorComponent errorMessage='Failed while fetching valuations' />;
		}

		return (
			<Component
				{...(props as unknown as T)}
				portfolios={calculatePortfolios(
					valuationQueryResults.map((result) => result.data!)
				).map((portfolio) =>
					props.portfolioFn(props.assets, props.instruments, portfolio)
				)}
			/>
		);
	};
}

function calculatePortfolios(valuations: Valuation[]): Portfolio[] {
	const dateToValuations = new Map<string, Valuation[]>();

	for (const valuation of valuations) {
		if (
			valuation.investedValue === 0 &&
			valuation.currentValue === 0 &&
			valuation.xirrPercent === 0
		) {
			continue;
		}
		const valuations = dateToValuations.get(valuation.date) || [];
		valuations.push(valuation);
		dateToValuations.set(valuation.date, valuations);
	}

	return Array.from(dateToValuations.values()).flatMap((valuations) => {
		return calculatePortfolio(valuations);
	});
}

function calculatePortfolio(valuations: Valuation[]): Portfolio[] {
	const totalInvestedValue = valuations.reduce((sum, valuation) => {
		return sum + valuation.investedValue;
	}, 0);

	const totalCurrentValue = valuations.reduce((sum, valuation) => {
		return sum + valuation.currentValue;
	}, 0);

	return valuations.map((valuation) => {
		return {
			id: valuation.id,
			date: valuation.date,
			type: PortfolioType.Unknown,
			investedValue: valuation.investedValue,
			investedValuePercent:
				(valuation.investedValue / Math.max(totalInvestedValue, 1)) * 100,
			currentValue: valuation.currentValue,
			currentValuePercent:
				(valuation.currentValue / Math.max(totalCurrentValue, 1)) * 100,
			xirrPercent: valuation.xirrPercent,
		};
	});
}
