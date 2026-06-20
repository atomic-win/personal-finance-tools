import { useSearch } from '@tanstack/react-router';
import ErrorComponent from '@/components/error-component';
import LoadingComponent from '@/components/loading-component';
import { useMutualFundQueries } from '@/features/indian-mutual-funds-analysis/hooks/mutualfunds';
import type { MutualFund } from '@/features/indian-mutual-funds-analysis/lib/types';

export function withMutualFunds<
	T extends {
		mutualfunds: MutualFund[];
	},
>(Component: React.ComponentType<T>) {
	return function WithMutualFunds(props: Omit<T, 'mutualfunds'>) {
		const search = useSearch({ strict: false }) as Record<
			string,
			string | string[]
		>;
		const rawCodes = search.mfSchemeCode;
		const codes = Array.isArray(rawCodes)
			? rawCodes.map(Number)
			: rawCodes
				? [Number(rawCodes)]
				: [];
		const mutualFundQueries = useMutualFundQueries(codes);

		if (mutualFundQueries.some((q) => q.isLoading)) {
			return <LoadingComponent loadingMessage='Loading mutual fund data...' />;
		}

		if (
			mutualFundQueries.some((q) => q.isError) ||
			mutualFundQueries.some((q) => !q.data)
		) {
			return <ErrorComponent errorMessage='Failed to load mutual fund data.' />;
		}

		// biome-ignore lint/style/noNonNullAssertion: We are sure that the data will always be available as we are checking for errors and loading states above.
		const mutualFunds = mutualFundQueries.map((q) => q.data!) as MutualFund[];

		return <Component {...(props as T)} mutualfunds={mutualFunds} />;
	};
}
