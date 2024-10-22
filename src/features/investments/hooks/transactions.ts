import { useQuery } from '@tanstack/react-query';
import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';
import { Transaction } from '@/features/investments/lib/types';
import { Currency } from '@/lib/types';

export default function useAllTransactionsQuery(
	currency: Currency | undefined
) {
	const primalApiClient = usePrimalApiClient();

	return useQuery({
		queryKey: [
			'investments',
			'transactions',
			{
				currency,
			},
		],
		queryFn: async () => {
			const response = await primalApiClient.get(
				`/investments/transactions?currency=${currency}`
			);
			const transactions = response.data as Transaction[];
			return transactions.sort((a, b) => b.date.localeCompare(a.date));
		},
		enabled: !!currency,
	});
}
