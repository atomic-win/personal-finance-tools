import { useMutualFundQueries } from '@/features/indian-mutual-funds-analysis/hooks/mutualfunds';
import { MutualFund } from '@/features/indian-mutual-funds-analysis/lib/types';
import { useSearchParams } from 'next/navigation';

import LoadingComponent from '@/components/loading-component';
import ErrorComponent from '@/components/error-component';

export function withMutualFunds<
	T extends {
		mutualfunds: MutualFund[];
	},
>(Component: React.ComponentType<T>) {
	return function WithMutualFunds(props: Omit<T, 'mutualfunds'>) {
		const searchParams = useSearchParams();
		const mutualFundQueries = useMutualFundQueries(
			searchParams.getAll('mfSchemeCode').map(Number)
		);

		if (mutualFundQueries.some((q) => q.isLoading)) {
			return <LoadingComponent loadingMessage='Loading mutual fund data...' />;
		}

		if (mutualFundQueries.some((q) => q.isError)) {
			return <ErrorComponent errorMessage='Failed to load mutual fund data.' />;
		}

		const mutualFunds = mutualFundQueries.map((q) => q.data!) as MutualFund[];

		return <Component {...(props as T)} mutualfunds={mutualFunds} />;
	};
}
