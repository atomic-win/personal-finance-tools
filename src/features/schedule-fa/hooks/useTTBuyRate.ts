import { useQuery } from '@tanstack/react-query';
import { fetchTTBuyRate } from '@/features/schedule-fa/lib/server-functions';
import type { ExchangeRate } from '@/features/schedule-fa/lib/types';

export function useTTBuyRate(from = 'USD', enabled = true) {
	return useQuery({
		queryKey: ['tt-buy-rate', from],
		queryFn: () => fetchTTBuyRate({ data: { from } }) as Promise<ExchangeRate[]>,
		enabled,
		staleTime: Number.POSITIVE_INFINITY,
	});
}
