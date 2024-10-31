import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';
import { Currency } from '@/lib/types';
import { Transaction } from '@/features/investments/lib/types';
import { useAssetTransactionsQueries } from '@/features/investments/hooks/transactions';

export default function withTransactions<
	T extends { transactions: Transaction[] }
>(Component: React.ComponentType<T>) {
	return function WithTransactions(
		props: Omit<T, 'transactions'> & {
			currency: Currency;
			assetIds: string[];
		}
	) {
		const assetTransactionsResults = useAssetTransactionsQueries(
			props.currency,
			props.assetIds
		);

		if (assetTransactionsResults.some((result) => result.isFetching)) {
			return <LoadingComponent loadingMessage='Fetching transactions' />;
		}

		if (assetTransactionsResults.some((result) => result.isError)) {
			return (
				<ErrorComponent errorMessage='Failed while fetching transactions' />
			);
		}

		return (
			<Component
				{...(props as unknown as T)}
				transactions={assetTransactionsResults.flatMap((x) => x.data!)}
			/>
		);
	};
}
