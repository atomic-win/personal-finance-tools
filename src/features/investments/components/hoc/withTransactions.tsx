import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';
import { Currency } from '@/lib/types';
import useAllTransactionsQuery from '@/features/investments/hooks/transactions';
import { Transaction } from '@/features/investments/lib/types';

export default function withTransactions<
	T extends { transactions: Transaction[] }
>(Component: React.ComponentType<T>) {
	return function WithTransactions(
		props: Omit<T, 'transactions'> & {
			currency: Currency;
		}
	) {
		const {
			data: transactions,
			isFetching,
			error: transactionsError,
		} = useAllTransactionsQuery(props.currency);

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
