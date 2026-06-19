import { useQueries } from '@tanstack/react-query';
import { fetchTTBuyRate } from '@/features/schedule-fa/server/fetch-tt-buy-rate';
import type { ExchangeRate } from '@/features/schedule-fa/lib/types';

export function useTTBuyRateQueries(currencies: string[], enabled = true) {
	return useQueries({
		queries: currencies.map((from) => ({
			queryKey: ['tt-buy-rate', from],
			queryFn: () =>
				fetchTTBuyRate({ data: { from } }) as Promise<ExchangeRate[]>,
			enabled,
			staleTime: Number.POSITIVE_INFINITY,
			select: (data: ExchangeRate[]) => ({ currency: from.toUpperCase(), rates: data }),
		})),
	});
}
