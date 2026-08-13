import type { SupportedIndex } from '@/features/investment-analysis/lib/types';

export const SUPPORTED_INDEXES: SupportedIndex[] = [
	{ symbol: '^NSEI', name: 'Nifty 50', currency: 'INR' },
	{ symbol: '^BSESN', name: 'BSE Sensex', currency: 'INR' },
	{ symbol: '^NSEMDCP50', name: 'Nifty Midcap 50', currency: 'INR' },
	{ symbol: '^CRSLDX', name: 'Nifty 500', currency: 'INR' },
	{ symbol: 'NIFTY_TOTAL_MKT.NS', name: 'Nifty Total Market', currency: 'INR' },
	{ symbol: '^NDX', name: 'NASDAQ 100', currency: 'USD' },
	{ symbol: '^IXIC', name: 'NASDAQ Composite', currency: 'USD' },
	{ symbol: '^GSPC', name: 'S&P 500', currency: 'USD' },
	{ symbol: '^DJI', name: 'Dow Jones Industrial Average', currency: 'USD' },
	{ symbol: '^RUT', name: 'Russell 2000', currency: 'USD' },
	{ symbol: '^FTSE', name: 'FTSE 100', currency: 'GBP' },
	{ symbol: '^GDAXI', name: 'DAX', currency: 'EUR' },
	{ symbol: '^STOXX50E', name: 'EURO STOXX 50', currency: 'EUR' },
	{ symbol: '^N225', name: 'Nikkei 225', currency: 'JPY' },
];

export const SUPPORTED_INDEX_SYMBOLS = SUPPORTED_INDEXES.map((x) => x.symbol);

export function getSupportedIndex(symbol: string) {
	return SUPPORTED_INDEXES.find((x) => x.symbol === symbol);
}
