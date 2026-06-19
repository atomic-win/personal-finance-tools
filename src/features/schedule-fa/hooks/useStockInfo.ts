import { useQueries } from '@tanstack/react-query';
import { fetchStockInfo } from '@/features/schedule-fa/server/fetch-stock-info';
import type { StockInfoResponse } from '@/features/schedule-fa/lib/types';

export function useStockInfoQueries(symbols: string[]) {
	return useQueries({
		queries: symbols.map((symbol) => ({
			queryKey: ['stock-info', symbol],
			queryFn: () =>
				fetchStockInfo({ data: { symbol } }) as Promise<StockInfoResponse>,
			enabled: !!symbol,
			staleTime: Number.POSITIVE_INFINITY,
			select: (data: StockInfoResponse) => ({ ...data, symbol: symbol.toUpperCase() }),
		})),
	});
}
