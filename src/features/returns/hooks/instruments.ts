import { useQuery, useQueries } from '@tanstack/react-query';
import {
	getMutualFundsList,
	getMutualFundRates,
} from '@/features/returns/services/mfApiService';
import { InstrumentType } from '@/features/returns/lib/types';
import {
	getIndexesList,
	getIndexRates,
} from '@/features/returns/services/indexesApiService';

export function useInstrumentListQuery(instrumentType: InstrumentType) {
	return useQuery({
		queryKey: ['instruments', instrumentType, 'list'],
		queryFn: async () => {
			switch (instrumentType) {
				case InstrumentType.MutualFund:
					return await getMutualFundsList();
				case InstrumentType.Index:
					return await getIndexesList();
				default:
					throw new Error(`Unsupported instrument type: ${instrumentType}`);
			}
		},
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
			queryFn: async () => {
				switch (instrumentType) {
					case InstrumentType.MutualFund:
						return await getMutualFundRates(Number(symbol));
					case InstrumentType.Index:
						return await getIndexRates(symbol);
					default:
						throw new Error(`Unsupported instrument type: ${instrumentType}`);
				}
			},
			staleTime: 1000 * 60 * 60, // 1 hour
			refetchInterval: 1000 * 60 * 60, // 1 hour
			refetchIntervalInBackground: true,
		})),
	});
}
