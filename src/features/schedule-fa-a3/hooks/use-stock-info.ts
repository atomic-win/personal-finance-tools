import { useQueries } from '@tanstack/react-query';
import type { StockData } from '@/features/schedule-fa-a3/lib/types';
import { fetchStockInfo } from '@/features/schedule-fa-a3/server/fetch-stock-info';

export function useStockInfoQueries(symbols: string[]) {
	return useQueries({
		queries: symbols.map((symbol) => ({
			queryKey: ['stock-info', symbol],
			queryFn: () => fetchStockInfo({ data: { symbol } }) as Promise<StockData>,
			enabled: !!symbol,
			staleTime: Infinity,
			select: (data: StockData) => ({
				...data,
				symbol: symbol.toUpperCase(),
			}),
		})),
	});
}
