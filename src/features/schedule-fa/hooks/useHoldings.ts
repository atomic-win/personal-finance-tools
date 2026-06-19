import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { HoldingInput } from '@/features/schedule-fa/lib/types';

const QUERY_KEY = ['schedule-fa-holdings'];

export function useHoldings() {
	const queryClient = useQueryClient();

	const { data: holdings = [] } = useQuery<HoldingInput[]>({
		queryKey: QUERY_KEY,
		queryFn: () => queryClient.getQueryData<HoldingInput[]>(QUERY_KEY) ?? [],
		staleTime: Number.POSITIVE_INFINITY,
	});

	const { mutate: setHoldings } = useMutation({
		mutationFn: async (updated: HoldingInput[]) => updated,
		onSuccess: (data) => {
			queryClient.setQueryData(QUERY_KEY, data);
		},
	});

	const clearHoldings = () => {
		queryClient.setQueryData(QUERY_KEY, []);
	};

	return { holdings, setHoldings, clearHoldings };
}
