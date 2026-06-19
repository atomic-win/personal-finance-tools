import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime } from 'luxon';
import yahooFinance from 'yahoo-finance2';

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const from = req.query.from;
	if (!from || typeof from !== 'string') {
		return res
			.status(400)
			.json({ error: 'Missing required query parameter: from' });
	}

	const ticker = `${from.toUpperCase()}INR=X`;

	try {
		const history = await yahooFinance.historical(ticker, {
			period1: '2000-01-01',
		});

		const rates = history.map((entry) => ({
			date: formatDate(entry.date),
			rate: entry.close,
		}));

		res.setHeader(
			'Cache-Control',
			's-maxage=86400, stale-while-revalidate=3600'
		);
		return res.status(200).json(rates);
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error';
		return res.status(500).json({
			error: `Failed to fetch exchange rates for ${from}→INR`,
			message,
		});
	}
}

function formatDate(date: Date): string {
	return DateTime.fromJSDate(date).toISODate() ?? '';
}
