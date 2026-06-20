import { useQueries } from '@tanstack/react-query';
import type { ExchangeRate } from '@/features/schedule-fa/lib/types';
import { fetchTTBuyRate } from '@/features/schedule-fa/server/fetch-tt-buy-rate';

export function useTTBuyRateQueries(currencies: string[]) {
	return useQueries({
		queries: currencies.map((from) => ({
			queryKey: ['tt-buy-rate', from],
			queryFn: () =>
				fetchTTBuyRate({ data: { from } }) as Promise<ExchangeRate[]>,
			enabled: !!from,
			staleTime: Infinity,
			select: (data: ExchangeRate[]) => ({
				currency: from.toUpperCase(),
				rates: data,
			}),
		})),
	});
}
