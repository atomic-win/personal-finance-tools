import { createServerFn } from '@tanstack/react-start';
import { DateTime } from 'luxon';
import YahooFinance from 'yahoo-finance2';
import { z } from 'zod';
import { SUPPORTED_INDEX_SYMBOLS } from '@/features/investment-analysis/lib/indexes';

const yf = new YahooFinance();

const indexHistoryInputSchema = z.object({
	symbol: z.string().refine((x) => SUPPORTED_INDEX_SYMBOLS.includes(x), {
		message: 'Unsupported index symbol',
	}),
});

export const fetchIndexHistory = createServerFn({ method: 'GET' })
	.inputValidator(indexHistoryInputSchema)
	.handler(async ({ data }) => {
		const { symbol } = data;
		const today = DateTime.now().toISODate() ?? '2025-12-31';

		const chart = await yf.chart(symbol, {
			period1: '1970-01-01',
			period2: today,
			interval: '1d',
		});

		const prices: Record<string, number> = {};

		for (const quote of chart.quotes ?? []) {
			const date = DateTime.fromJSDate(quote.date).toUTC().toISODate();
			const close = quote.close ?? quote.adjclose;

			if (date && close) {
				prices[date] = close;
			}
		}

		return {
			symbol,
			currency: chart.meta?.currency ?? 'USD',
			prices,
		};
	});
