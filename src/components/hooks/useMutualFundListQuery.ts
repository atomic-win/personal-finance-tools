import { useQuery } from '@tanstack/react-query';
import { mfApiClient } from './mfApiClient';

export interface MutualFundListItem {
	schemeCode: number;
	schemeName: string;
}

export function useMutualFundListQuery() {
	return useQuery({
		queryKey: ['mutualfunds', 'list'],
		queryFn: async () => {
			return await mfApiClient.get('mf');
		},
		select: (response) => response.data as MutualFundListItem[],
		staleTime: 1000 * 60 * 60 * 24, // 24 hours
		refetchInterval: 1000 * 60 * 60 * 24, // 24 hours
		refetchIntervalInBackground: true,
	});
}
