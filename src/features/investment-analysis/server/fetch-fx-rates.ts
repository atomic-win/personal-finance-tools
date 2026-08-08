import { createServerFn } from '@tanstack/react-start';
import { DateTime } from 'luxon';
import YahooFinance from 'yahoo-finance2';
import { z } from 'zod';

const yf = new YahooFinance();

const fxRatesInputSchema = z.object({
	from: z.string().length(3),
	to: z.string().length(3),
});

export const fetchFxRates = createServerFn({ method: 'GET' })
	.inputValidator(fxRatesInputSchema)
	.handler(async ({ data }) => {
		const from = data.from.toUpperCase();
		const to = data.to.toUpperCase();

		if (from === to) {
			return { from, to, rates: {} as Record<string, number> };
		}

		const today = DateTime.now().toISODate() ?? '2025-12-31';

		const chart = await yf.chart(`${from}${to}=X`, {
			period1: '1970-01-01',
			period2: today,
			interval: '1d',
		});

		const rates: Record<string, number> = {};

		for (const quote of chart.quotes ?? []) {
			const date = DateTime.fromJSDate(quote.date).toUTC().toISODate();
			const close = quote.close ?? quote.adjclose;

			if (date && close) {
				rates[date] = close;
			}
		}

		return { from, to, rates };
	});
