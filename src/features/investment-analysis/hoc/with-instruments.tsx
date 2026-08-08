import { useSearch } from '@tanstack/react-router';
import _ from 'lodash';
import ErrorComponent from '@/components/error-component';
import LoadingComponent from '@/components/loading-component';
import {
	useFxRatesQueries,
	useIndexQueries,
	useMutualFundQueries,
} from '@/features/investment-analysis/hooks/instruments';
import type { Instrument } from '@/features/investment-analysis/lib/types';
import { convertInstrumentCurrency } from '@/features/investment-analysis/lib/utils';
import { useCurrencyQuery } from '@/hooks/use-currency-query';

export function getSearchParamValues(
	search: Record<string, string | string[]>,
	key: string
): string[] {
	const value = search[key];

	if (Array.isArray(value)) {
		return value;
	}

	return value ? [value] : [];
}

export function withInstruments<
	T extends {
		instruments: Instrument[];
	},
>(Component: React.ComponentType<T>) {
	return function WithInstruments(props: Omit<T, 'instruments'>) {
		const search = useSearch({ strict: false }) as Record<
			string,
			string | string[]
		>;
		const currencyQuery = useCurrencyQuery();
		const targetCurrency = currencyQuery.data || 'USD';

		const schemeCodes = getSearchParamValues(search, 'mfSchemeCode').map(
			Number
		);
		const indexSymbols = getSearchParamValues(search, 'indexSymbol');

		const mutualFundQueries = useMutualFundQueries(schemeCodes);
		const indexQueries = useIndexQueries(indexSymbols);

		const instrumentQueries = [...mutualFundQueries, ...indexQueries];

		const nativeCurrencies = _.uniq(
			instrumentQueries
				.map((q) => q.data?.currency)
				.filter((x): x is string => !!x)
		);
		const fxRatesQueries = useFxRatesQueries(nativeCurrencies, targetCurrency);

		if (currencyQuery.isLoading || instrumentQueries.some((q) => q.isLoading)) {
			return <LoadingComponent loadingMessage='Loading investment data...' />;
		}

		if (
			instrumentQueries.some((q) => q.isError) ||
			instrumentQueries.some((q) => !q.data)
		) {
			return <ErrorComponent errorMessage='Failed to load investment data.' />;
		}

		if (fxRatesQueries.some((q) => q.isLoading)) {
			return <LoadingComponent loadingMessage='Loading exchange rates...' />;
		}

		if (fxRatesQueries.some((q) => q.isError)) {
			return <ErrorComponent errorMessage='Failed to load exchange rates.' />;
		}

		const fxRatesByCurrency = Object.fromEntries(
			nativeCurrencies.map((currency, i) => [
				currency,
				fxRatesQueries[i].data ?? {},
			])
		);

		const instruments = instrumentQueries
			// biome-ignore lint/style/noNonNullAssertion: We are sure that the data will always be available as we are checking for errors and loading states above.
			.map((q) => q.data!)
			.map((instrument) =>
				convertInstrumentCurrency(
					instrument,
					fxRatesByCurrency[instrument.currency] ?? {},
					targetCurrency
				)
			);

		return <Component {...(props as T)} instruments={instruments} />;
	};
}
