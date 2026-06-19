import { useQueries, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { StockInfoResponse } from '@/features/schedule-fa/lib/types';

async function fetchStockInfo(symbol: string): Promise<StockInfoResponse> {
	const { data } = await axios.get<StockInfoResponse>('/api/stock-info', {
		params: { symbol },
	});
	return data;
}

export function useStockInfo(symbol: string | null) {
	return useQuery({
		queryKey: ['stock-info', symbol],
		queryFn: () => fetchStockInfo(symbol!),
		enabled: !!symbol,
		staleTime: Number.POSITIVE_INFINITY,
	});
}

export function useMultipleStockInfo(symbols: string[]) {
	const results = useQueries({
		queries: symbols.map((symbol) => ({
			queryKey: ['stock-info', symbol],
			queryFn: () => fetchStockInfo(symbol),
			enabled: !!symbol,
			staleTime: Number.POSITIVE_INFINITY,
		})),
	});

	return results.map((result, index) => ({
		symbol: symbols[index],
		...result,
	}));
}
