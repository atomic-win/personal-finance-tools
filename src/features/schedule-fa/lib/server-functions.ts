import { createServerFn } from '@tanstack/react-start';
import { DateTime } from 'luxon';
import YahooFinance from 'yahoo-finance2';
import { z } from 'zod';

const yf = new YahooFinance();

const stockInfoInputSchema = z.object({
	symbol: z.string().min(1),
});

export const fetchStockInfo = createServerFn({ method: 'GET' })
	.inputValidator(stockInfoInputSchema)
	.handler(async ({ data }) => {
		const { symbol } = data;

		const today = DateTime.now().toISODate() ?? '2025-12-31';

		const [quoteSummary, chartData, dividendChart] = await Promise.all([
			yf.quoteSummary(symbol, { modules: ['price', 'quoteType'] }),
			yf.chart(symbol, { period1: '2000-01-01', period2: today }),
			yf.chart(symbol, {
				period1: '2000-01-01',
				period2: today,
				events: 'div',
			}),
		]);

		const price = quoteSummary.price;
		const quoteType = quoteSummary.quoteType;

		const dailyPrices = (chartData.quotes ?? []).map((q) => ({
			date: formatDate(q.date),
			close: q.close ?? 0,
			high: q.high ?? 0,
		}));

		const dividends = (dividendChart.events?.dividends ?? []).map((d) => ({
			date: formatDate(d.date),
			amount: d.amount,
		}));

		return {
			symbol,
			name: price?.longName ?? quoteType?.longName ?? symbol,
			exchange: price?.exchangeName ?? quoteType?.exchange ?? '',
			country: getCountryFromExchange(price?.exchangeName ?? ''),
			countryCode: getCountryCodeFromExchange(price?.exchangeName ?? ''),
			dailyPrices,
			dividends,
		};
	});

const ttBuyRateInputSchema = z.object({
	from: z.string().min(1),
});

export const fetchTTBuyRate = createServerFn({ method: 'GET' })
	.inputValidator(ttBuyRateInputSchema)
	.handler(async ({ data }) => {
		const ticker = `${data.from.toUpperCase()}INR=X`;

		const today = DateTime.now().toISODate() ?? '2025-12-31';
		const chartData = await yf.chart(ticker, {
			period1: '2000-01-01',
			period2: today,
		});

		return (chartData.quotes ?? []).map((entry) => ({
			date: formatDate(entry.date),
			rate: entry.close ?? 0,
		}));
	});

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
