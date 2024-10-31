import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';
import { Currency } from '@/lib/types';
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import { Transaction, TransactionType } from '@/features/investments/lib/types';

export type AddTransactionRequest = {
	date: string;
	name: string;
	type: TransactionType;
	assetId: string;
	units: number;
};

export type DeleteTransactionRequest = {
	assetId: string;
	transactionId: string;
};

export function useAssetTransactionsQueries(
	currency: Currency | undefined,
	assetIds: string[] | undefined
) {
	const primalApiClient = usePrimalApiClient();

	return useQueries({
		queries: (assetIds || []).map((assetId) => ({
			queryKey: [
				'investments',
				'assets',
				assetId,
				'transactions',
				{
					currency,
				},
			],
			queryFn: async () => {
				const response = await primalApiClient.get(
					`/investments/assets/${assetId}/transactions?currency=${currency}`
				);
				const transactions = response.data as Transaction[];
				return transactions.sort((a, b) => b.date.localeCompare(a.date));
			},
			select: (data: Transaction[]) =>
				data.map((x) => ({
					...x,
					assetId,
				})),
			enabled: !!currency && !!assetId,
		})),
	});
}

export function useDeleteTransactionMutation() {
	const queryClient = useQueryClient();
	const primalApiClient = usePrimalApiClient();

	return useMutation({
		mutationFn: async (request: DeleteTransactionRequest) => {
			await primalApiClient.delete(
				`investments/assets/${request.assetId}/transactions/${request.transactionId}`
			);
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ['investments'],
			});
		},
	});
}

export function useAddTransactionMutation() {
	const queryClient = useQueryClient();
	const primalApiClient = usePrimalApiClient();

	return useMutation({
		mutationFn: async (transaction: AddTransactionRequest) => {
			if (transaction.type === TransactionType.Unknown) {
				return;
			}

			await primalApiClient.post(
				`/investments/assets/${transaction.assetId}/transactions`,
				transaction
			);
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ['investments'],
			});
		},
	});
}
