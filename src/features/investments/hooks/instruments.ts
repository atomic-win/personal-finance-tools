import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';
import { UseQueryOptions, useQueries } from '@tanstack/react-query';
import { Instrument } from '@/features/investments/lib/types';

export default function useInstrumentByIdQueries(instrumentIds: string[]) {
	const primalApiClient = usePrimalApiClient();
	instrumentIds = Array.from(new Set(instrumentIds));

	return useQueries({
		queries: instrumentIds.map(
			(id) =>
				({
					queryKey: ['investments', 'instruments', id],
					queryFn: async () => {
						const response = await primalApiClient.get(
							`/investments/instruments/${id}`
						);
						return response.data as Instrument;
					},
					enabled: !!id,
				} as UseQueryOptions<Instrument>)
		),
	});
}
