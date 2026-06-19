import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { ExchangeRate } from '@/features/schedule-fa/lib/types';

async function fetchTTBuyRate(from: string): Promise<ExchangeRate[]> {
	const { data } = await axios.get<ExchangeRate[]>('/api/tt-buy-rate', {
		params: { from },
	});
	return data;
}

export function useTTBuyRate(from = 'USD', enabled = true) {
	return useQuery({
		queryKey: ['tt-buy-rate', from],
		queryFn: () => fetchTTBuyRate(from),
		enabled,
		staleTime: Number.POSITIVE_INFINITY,
	});
}
