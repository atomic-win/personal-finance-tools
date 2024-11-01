import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';
import { Currency } from '@/lib/types';
import {
	QueryClient,
	useMutation,
	useQueries,
	useQueryClient,
} from '@tanstack/react-query';
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
	date: string;
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
		onSettled: (_data, _error, request) => onSettled(queryClient, request),
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
		onSettled: (_data, _error, request) => onSettled(queryClient, request),
	});
}

function onSettled(
	queryClient: QueryClient,
	request: DeleteTransactionRequest | AddTransactionRequest
) {
	queryClient.invalidateQueries({
		predicate: (query) => {
			if (
				query.queryKey[0] !== 'investments' ||
				query.queryKey[1] !== 'assets'
			) {
				return false;
			}

			if (
				query.queryKey[2] === request.assetId &&
				query.queryKey[3] === 'transactions'
			) {
				return true;
			}

			if (query.queryKey[2] !== 'valuation') {
				return false;
			}

			const valuationQueryData = query.queryKey[3] as {
				assetIds: string[];
				date: string;
			};

			return (
				valuationQueryData.assetIds.includes(request.assetId) &&
				valuationQueryData.date >= request.date
			);
		},
	});
}
