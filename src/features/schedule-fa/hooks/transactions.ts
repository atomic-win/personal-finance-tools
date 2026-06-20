import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { v7 } from 'uuid';
import type { Transaction } from '@/features/schedule-fa/lib/types';

const QUERY_KEY = ['schedule-fa-transactions'];

export function useTransactionsQuery() {
	const queryClient = useQueryClient();

	return useQuery({
		queryKey: QUERY_KEY,
		queryFn: async () => {
			const data = queryClient.getQueryData<Transaction[]>(QUERY_KEY);

			if (data) {
				return data;
			}

			queryClient.setQueryData<Transaction[]>(QUERY_KEY, []);
			return [];
		},
		staleTime: Number.POSITIVE_INFINITY,
	});
}

export function useSetTransactionsMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: [...QUERY_KEY, 'set'],
		mutationFn: async (transactions: Transaction[]) => {
			await queryClient.cancelQueries({ queryKey: QUERY_KEY });

			const previousData = queryClient.getQueryData<Transaction[]>(QUERY_KEY);

			const withIds = transactions.map((t) => ({
				...t,
				id: t.id || v7(),
				symbol: t.symbol.toUpperCase(),
			}));

			queryClient.setQueryData<Transaction[]>(QUERY_KEY, withIds);

			return { previousData };
		},
		onError: (err, _variables, context) => {
			console.error(err);
			queryClient.setQueryData(
				QUERY_KEY,
				(context as { previousData: Transaction[] }).previousData
			);
		},
	});
}

export function useAddTransactionMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: [...QUERY_KEY, 'add'],
		mutationFn: async () => {
			await queryClient.cancelQueries({ queryKey: QUERY_KEY });

			const previousData = queryClient.getQueryData<Transaction[]>(QUERY_KEY);

			queryClient.setQueryData<Transaction[]>(QUERY_KEY, [
				...(previousData ?? []),
				{
					id: v7(),
					symbol: '',
					date: '',
					type: 'Buy',
					units: 0,
					price: 0,
					remarks: '',
				},
			]);

			return { previousData };
		},
		onError: (err, _variables, context) => {
			console.error(err);
			queryClient.setQueryData(
				QUERY_KEY,
				(context as { previousData: Transaction[] }).previousData
			);
		},
	});
}

export function useUpdateTransactionMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: [...QUERY_KEY, 'update'],
		mutationFn: async (transaction: Transaction) => {
			await queryClient.cancelQueries({ queryKey: QUERY_KEY });

			const previousData = queryClient.getQueryData<Transaction[]>(QUERY_KEY);

			const normalized = {
				...transaction,
				symbol: transaction.symbol.toUpperCase(),
			};

			queryClient.setQueryData<Transaction[]>(
				QUERY_KEY,
				previousData?.map((t) => (t.id === normalized.id ? normalized : t))
			);

			return { previousData };
		},
		onError: (err, _variables, context) => {
			console.error(err);
			queryClient.setQueryData(
				QUERY_KEY,
				(context as { previousData: Transaction[] }).previousData
			);
		},
	});
}

export function useRemoveTransactionMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: [...QUERY_KEY, 'delete'],
		mutationFn: async (id: string) => {
			await queryClient.cancelQueries({ queryKey: QUERY_KEY });

			const previousData = queryClient.getQueryData<Transaction[]>(QUERY_KEY);

			queryClient.setQueryData<Transaction[]>(
				QUERY_KEY,
				previousData?.filter((t) => t.id !== id)
			);

			return { previousData };
		},
		onError: (err, _variables, context) => {
			console.error(err);
			queryClient.setQueryData(
				QUERY_KEY,
				(context as { previousData: Transaction[] }).previousData
			);
		},
	});
}

export function useClearTransactionsMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: [...QUERY_KEY, 'clear'],
		mutationFn: async () => {
			await queryClient.cancelQueries({ queryKey: QUERY_KEY });

			const previousData = queryClient.getQueryData<Transaction[]>(QUERY_KEY);

			queryClient.setQueryData<Transaction[]>(QUERY_KEY, []);

			return { previousData };
		},
		onError: (err, _variables, context) => {
			console.error(err);
			queryClient.setQueryData(
				QUERY_KEY,
				(context as { previousData: Transaction[] }).previousData
			);
		},
	});
}
