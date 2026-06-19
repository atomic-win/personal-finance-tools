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
			yf.quoteSummary(symbol, {
				modules: ['price', 'quoteType', 'summaryProfile'],
			}),
			yf.chart(symbol, { period1: '2000-01-01', period2: today }),
			yf.chart(symbol, {
				period1: '2000-01-01',
				period2: today,
				events: 'div',
			}),
		]);

		const price = quoteSummary.price;
		const quoteType = quoteSummary.quoteType;
		const profile = quoteSummary.summaryProfile;

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
			currency: price?.currency ?? chartData.meta?.currency ?? 'USD',
			country: profile?.country ?? getCountryFromExchange(price?.exchangeName ?? ''),
			countryCode: getCountryCodeFromCountry(profile?.country ?? '') || getCountryCodeFromExchange(price?.exchangeName ?? ''),
			address: profile?.address1 ?? '',
			city: profile?.city ?? '',
			state: profile?.state ?? '',
			zip: profile?.zip ?? '',
			dailyPrices,
			dividends,
		};
	});

const SBI_RATES_BASE_URL =
	'https://raw.githubusercontent.com/sahilgupta/sbi-fx-ratekeeper/main/csv_files';

const ttBuyRateInputSchema = z.object({
	from: z.string().min(1),
});

export const fetchTTBuyRate = createServerFn({ method: 'GET' })
	.inputValidator(ttBuyRateInputSchema)
	.handler(async ({ data }) => {
		const currency = data.from.toUpperCase();
		const url = `${SBI_RATES_BASE_URL}/SBI_REFERENCE_RATES_${currency}.csv`;
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to fetch SBI rates for ${currency}`);
		}

		const csvText = await response.text();
		const lines = csvText.trim().split('\n');

		if (lines.length < 2) {
			throw new Error(`No data found for ${currency}`);
		}

		const header = lines[0].split(',').map((h) => h.trim());
		const dateIdx = header.indexOf('DATE');
		const ttBuyIdx = header.indexOf('TT BUY');

		if (dateIdx === -1 || ttBuyIdx === -1) {
			throw new Error(
				`Invalid CSV format: missing DATE or TT BUY column`,
			);
		}

		const rates: { date: string; rate: number }[] = [];
		for (let i = 1; i < lines.length; i++) {
			const cols = lines[i].split(',');
			const rawDate = cols[dateIdx]?.trim();
			const ttBuy = Number.parseFloat(cols[ttBuyIdx]?.trim());

			if (!rawDate || Number.isNaN(ttBuy) || ttBuy === 0) continue;

			// Date format: "2020-01-06 09:00" → parse with luxon
			const dt = DateTime.fromFormat(rawDate, 'yyyy-MM-dd HH:mm');
			if (!dt.isValid) continue;

			rates.push({ date: dt.toISODate()!, rate: ttBuy });
		}

		return rates;
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

const countryCodeMap: Record<string, string> = {
	'United States': 'US',
	'United Kingdom': 'GB',
	Japan: 'JP',
	Germany: 'DE',
	'Hong Kong': 'HK',
	Australia: 'AU',
	Canada: 'CA',
	France: 'FR',
	Switzerland: 'CH',
	Netherlands: 'NL',
	India: 'IN',
	China: 'CN',
	Singapore: 'SG',
	Ireland: 'IE',
	Sweden: 'SE',
};

function getCountryCodeFromCountry(country: string): string {
	return countryCodeMap[country] ?? '';
}
