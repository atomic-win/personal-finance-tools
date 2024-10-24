import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Asset } from '@/features/investments/lib/types';

export function useAllAssetsQuery() {
	const primalApiClient = usePrimalApiClient();

	return useQuery({
		queryKey: ['investments', 'assets'],
		queryFn: async () => {
			const response = await primalApiClient.get('/investments/assets');
			return response.data as Asset[];
		},
	});
}

export function useDeleteAssetMutation() {
	const queryClient = useQueryClient();
	const primalApiClient = usePrimalApiClient();

	return useMutation({
		mutationFn: async (assetId: string) => {
			await primalApiClient.delete(`investments/assets/${assetId}`);
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ['investments'],
			});
		},
	});
}
