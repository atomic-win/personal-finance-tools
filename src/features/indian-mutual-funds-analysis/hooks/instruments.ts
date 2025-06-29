import { useQuery, useQueries } from '@tanstack/react-query';
import {
	getMutualFundsList,
	getMutualFundRates,
} from '@/features/indian-mutual-funds-analysis/services/mfApiService';
import { InstrumentType } from '@/features/indian-mutual-funds-analysis/lib/types';

export function useInstrumentListQuery(instrumentType: InstrumentType) {
	return useQuery({
		queryKey: ['instruments', instrumentType, 'list'],
		queryFn: async () => await getMutualFundsList(),
		staleTime: 1000 * 60 * 60 * 24, // 24 hours
		refetchInterval: 1000 * 60 * 60 * 24, // 24 hours
		refetchIntervalInBackground: true,
	});
}

export function useInstrumentQueries(
	instrumentType: InstrumentType,
	symbols: string[]
) {
	return useQueries({
		queries: symbols.map((symbol) => ({
			queryKey: ['instruments', instrumentType, symbol],
			queryFn: async () => await getMutualFundRates(Number(symbol)),
			staleTime: 1000 * 60 * 60, // 1 hour
			refetchInterval: 1000 * 60 * 60, // 1 hour
			refetchIntervalInBackground: true,
		})),
	});
}
