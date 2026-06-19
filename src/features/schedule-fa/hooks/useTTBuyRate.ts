import { useQueries, useQuery } from '@tanstack/react-query';
import { fetchTTBuyRate } from '@/features/schedule-fa/server/fetch-tt-buy-rate';
import type { ExchangeRate } from '@/features/schedule-fa/lib/types';

export function useTTBuyRate(from = 'USD', enabled = true) {
	return useQuery({
		queryKey: ['tt-buy-rate', from],
		queryFn: () => fetchTTBuyRate({ data: { from } }) as Promise<ExchangeRate[]>,
		enabled,
		staleTime: Number.POSITIVE_INFINITY,
	});
}

export function useTTBuyRateQueries(currencies: string[], enabled = true) {
	const results = useQueries({
		queries: currencies.map((from) => ({
			queryKey: ['tt-buy-rate', from],
			queryFn: () =>
				fetchTTBuyRate({ data: { from } }) as Promise<ExchangeRate[]>,
			enabled,
			staleTime: Number.POSITIVE_INFINITY,
		})),
	});

	return results.map((result, index) => ({
		currency: currencies[index],
		...result,
	}));
}
