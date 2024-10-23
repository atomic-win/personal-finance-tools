import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';
import { Currency } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { Transaction } from '@/features/investments/lib/types';

export default function useTransactionsQuery(
	currency: Currency | undefined,
	assetId: string | undefined
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
		select: (data) => data.filter((t) => t.assetId === assetId),
		enabled: !!currency && !!assetId,
	});
}
