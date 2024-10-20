import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';
import { useQuery } from '@tanstack/react-query';
import { Asset } from '@/features/investments/lib/types';

export default function useAllAssetsQuery() {
	const primalApiClient = usePrimalApiClient();

	return useQuery({
		queryKey: ['investments', 'assets'],
		queryFn: async () => {
			const response = await primalApiClient.get('/investments/assets');
			return response.data as Asset[];
		},
	});
}
