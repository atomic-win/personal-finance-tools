import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime } from 'luxon';
import YahooFinance from 'yahoo-finance2';

const yf = new YahooFinance({ suppressNotices: ['ripHistorical'] });

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const symbol = req.query.symbol;
	if (!symbol || typeof symbol !== 'string') {
		return res
			.status(400)
			.json({ error: 'Missing required query parameter: symbol' });
	}

	try {
		const [quoteSummary, dailyPrices, dividends] = await Promise.all([
			yf.quoteSummary(symbol, { modules: ['price', 'quoteType'] }),
			yf.historical(symbol, {
				period1: '2000-01-01',
			}),
			yf.historical(symbol, {
				period1: '2000-01-01',
				events: 'dividends',
			}),
		]);

		const price = quoteSummary.price;
		const quoteType = quoteSummary.quoteType;

		const response = {
			symbol,
			name: price?.longName ?? quoteType?.longName ?? symbol,
			exchange: price?.exchangeName ?? quoteType?.exchange ?? '',
			country: getCountryFromExchange(price?.exchangeName ?? ''),
			countryCode: getCountryCodeFromExchange(price?.exchangeName ?? ''),
			dailyPrices: dailyPrices.map((p) => ({
				date: formatDate(p.date),
				close: p.close,
				high: p.high,
			})),
			dividends: dividends.map((d) => ({
				date: formatDate(d.date),
				amount: d.dividends,
			})),
		};

		res.setHeader(
			'Cache-Control',
			's-maxage=86400, stale-while-revalidate=3600'
		);
		return res.status(200).json(response);
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error';
		return res
			.status(404)
			.json({ error: `Failed to fetch data for symbol: ${symbol}`, message });
	}
}

function formatDate(date: Date): string {
	return DateTime.fromJSDate(date).toISODate() ?? '';
}

const exchangeCountryMap: Record<string, { country: string; code: string }> = {
	NMS: { country: 'United States', code: 'US' },
	NGM: { country: 'United States', code: 'US' },
	NYQ: { country: 'United States', code: 'US' },
	NYSE: { country: 'United States', code: 'US' },
	NASDAQ: { country: 'United States', code: 'US' },
	NasdaqGS: { country: 'United States', code: 'US' },
	NasdaqGM: { country: 'United States', code: 'US' },
	NasdaqCM: { country: 'United States', code: 'US' },
	LSE: { country: 'United Kingdom', code: 'GB' },
	TSE: { country: 'Japan', code: 'JP' },
	XETRA: { country: 'Germany', code: 'DE' },
	HKSE: { country: 'Hong Kong', code: 'HK' },
	ASX: { country: 'Australia', code: 'AU' },
	TSX: { country: 'Canada', code: 'CA' },
};

function getCountryFromExchange(exchange: string): string {
	return exchangeCountryMap[exchange]?.country ?? 'United States';
}

function getCountryCodeFromExchange(exchange: string): string {
	return exchangeCountryMap[exchange]?.code ?? 'US';
}
