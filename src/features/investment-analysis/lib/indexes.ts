import type { SupportedIndex } from '@/features/investment-analysis/lib/types';

export const SUPPORTED_INDEXES: SupportedIndex[] = [
	{ symbol: '^NDX', name: 'NASDAQ 100', currency: 'USD' },
	{ symbol: '^GSPC', name: 'S&P 500', currency: 'USD' },
];

export const SUPPORTED_INDEX_SYMBOLS = SUPPORTED_INDEXES.map((x) => x.symbol);

export function getSupportedIndex(symbol: string) {
	return SUPPORTED_INDEXES.find((x) => x.symbol === symbol);
}
