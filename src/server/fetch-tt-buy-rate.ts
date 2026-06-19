import { createServerFn } from '@tanstack/react-start';
import { DateTime } from 'luxon';
import { z } from 'zod';

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
			throw new Error('Invalid CSV format: missing DATE or TT BUY column');
		}

		const rates: { date: string; rate: number }[] = [];
		for (let i = 1; i < lines.length; i++) {
			const cols = lines[i].split(',');
			const rawDate = cols[dateIdx]?.trim();
			const ttBuy = Number.parseFloat(cols[ttBuyIdx]?.trim());

			if (!rawDate || Number.isNaN(ttBuy) || ttBuy === 0) continue;

			const dt = DateTime.fromFormat(rawDate, 'yyyy-MM-dd HH:mm');
			if (!dt.isValid) continue;

			rates.push({ date: dt.toISODate()!, rate: ttBuy });
		}

		return rates;
	});
