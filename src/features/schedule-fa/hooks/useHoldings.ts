import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Transaction } from '@/features/schedule-fa/lib/types';

const QUERY_KEY = ['schedule-fa-holdings'];

export function useHoldingsQuery() {
	const queryClient = useQueryClient();

	return useQuery({
		queryKey: QUERY_KEY,
		queryFn: async () => {
			const data =
				queryClient.getQueryData<Transaction[]>(QUERY_KEY);

			if (data) {
				return data;
			}

			queryClient.setQueryData<Transaction[]>(QUERY_KEY, []);
			return [];
		},
		staleTime: Number.POSITIVE_INFINITY,
	});
}

export function useSetHoldingsMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: [...QUERY_KEY, 'set'],
		mutationFn: async (holdings: Transaction[]) => {
			await queryClient.cancelQueries({ queryKey: QUERY_KEY });

			const previousData =
				queryClient.getQueryData<Transaction[]>(QUERY_KEY);

			queryClient.setQueryData<Transaction[]>(QUERY_KEY, holdings);

			return { previousData };
		},
		onError: (err, _variables, context) => {
			console.error(err);
			queryClient.setQueryData(
				QUERY_KEY,
				(context as { previousData: Transaction[] }).previousData,
			);
		},
	});
}

export function useAddHoldingsMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: [...QUERY_KEY, 'add'],
		mutationFn: async (newHoldings: Transaction[]) => {
			await queryClient.cancelQueries({ queryKey: QUERY_KEY });

			const previousData =
				queryClient.getQueryData<Transaction[]>(QUERY_KEY);

			queryClient.setQueryData<Transaction[]>(QUERY_KEY, [
				...(previousData ?? []),
				...newHoldings,
			]);

			return { previousData };
		},
		onError: (err, _variables, context) => {
			console.error(err);
			queryClient.setQueryData(
				QUERY_KEY,
				(context as { previousData: Transaction[] }).previousData,
			);
		},
	});
}

export function useClearHoldingsMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: [...QUERY_KEY, 'clear'],
		mutationFn: async () => {
			await queryClient.cancelQueries({ queryKey: QUERY_KEY });

			const previousData =
				queryClient.getQueryData<Transaction[]>(QUERY_KEY);

			queryClient.setQueryData<Transaction[]>(QUERY_KEY, []);

			return { previousData };
		},
		onError: (err, _variables, context) => {
			console.error(err);
			queryClient.setQueryData(
				QUERY_KEY,
				(context as { previousData: Transaction[] }).previousData,
			);
		},
	});
}
