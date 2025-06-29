import { useQuery, useQueries } from '@tanstack/react-query';
import {
	getMutualFundsList,
	getMutualFundRates,
} from '@/features/indian-mutual-funds-analysis/services/mfApiService';

export function useInstrumentListQuery() {
	return useQuery({
		queryKey: ['instruments', 'list'],
		queryFn: async () => await getMutualFundsList(),
		staleTime: 1000 * 60 * 60 * 24, // 24 hours
		refetchInterval: 1000 * 60 * 60 * 24, // 24 hours
		refetchIntervalInBackground: true,
	});
}

export function useInstrumentQueries(schemeCodes: number[]) {
	return useQueries({
		queries: schemeCodes.map((schemeCode) => ({
			queryKey: ['instruments', schemeCode],
			queryFn: async () => await getMutualFundRates(schemeCode),
			staleTime: 1000 * 60 * 60, // 1 hour
			refetchInterval: 1000 * 60 * 60, // 1 hour
			refetchIntervalInBackground: true,
		})),
	});
}
