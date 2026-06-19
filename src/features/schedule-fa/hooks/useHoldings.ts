import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { HoldingInput } from '@/features/schedule-fa/lib/types';

const QUERY_KEY = ['schedule-fa-holdings'];

export function useHoldingsQuery() {
	const queryClient = useQueryClient();

	return useQuery({
		queryKey: QUERY_KEY,
		queryFn: async () => {
			const data =
				queryClient.getQueryData<HoldingInput[]>(QUERY_KEY);

			if (data) {
				return data;
			}

			queryClient.setQueryData<HoldingInput[]>(QUERY_KEY, []);
			return [];
		},
		staleTime: Number.POSITIVE_INFINITY,
	});
}

export function useSetHoldingsMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: [...QUERY_KEY, 'set'],
		mutationFn: async (holdings: HoldingInput[]) => {
			await queryClient.cancelQueries({ queryKey: QUERY_KEY });

			const previousData =
				queryClient.getQueryData<HoldingInput[]>(QUERY_KEY);

			queryClient.setQueryData<HoldingInput[]>(QUERY_KEY, holdings);

			return { previousData };
		},
		onError: (err, _variables, context) => {
			console.error(err);
			queryClient.setQueryData(
				QUERY_KEY,
				(context as { previousData: HoldingInput[] }).previousData,
			);
		},
	});
}

export function useAddHoldingsMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: [...QUERY_KEY, 'add'],
		mutationFn: async (newHoldings: HoldingInput[]) => {
			await queryClient.cancelQueries({ queryKey: QUERY_KEY });

			const previousData =
				queryClient.getQueryData<HoldingInput[]>(QUERY_KEY);

			queryClient.setQueryData<HoldingInput[]>(QUERY_KEY, [
				...(previousData ?? []),
				...newHoldings,
			]);

			return { previousData };
		},
		onError: (err, _variables, context) => {
			console.error(err);
			queryClient.setQueryData(
				QUERY_KEY,
				(context as { previousData: HoldingInput[] }).previousData,
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
				queryClient.getQueryData<HoldingInput[]>(QUERY_KEY);

			queryClient.setQueryData<HoldingInput[]>(QUERY_KEY, []);

			return { previousData };
		},
		onError: (err, _variables, context) => {
			console.error(err);
			queryClient.setQueryData(
				QUERY_KEY,
				(context as { previousData: HoldingInput[] }).previousData,
			);
		},
	});
}
