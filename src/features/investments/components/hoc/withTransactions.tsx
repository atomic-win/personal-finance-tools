import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';
import { Currency } from '@/lib/types';
import { Transaction } from '@/features/investments/lib/types';
import useTransactionsQuery from '@/features/investments/hooks/transactions';

export default function withTransactions<
	T extends { transactions: Transaction[] }
>(Component: React.ComponentType<T>) {
	return function WithTransactions(
		props: Omit<T, 'transactions'> & {
			currency: Currency;
			assetId: string;
		}
	) {
		const {
			data: transactions,
			isFetching,
			error: transactionsError,
		} = useTransactionsQuery(props.currency, props.assetId);

		if (isFetching) {
			return <LoadingComponent loadingMessage='Fetching transactions' />;
		}

		if (transactionsError || !transactions) {
			return (
				<ErrorComponent errorMessage='Failed while fetching transactions' />
			);
		}

		return (
			<Component {...(props as unknown as T)} transactions={transactions} />
		);
	};
}
