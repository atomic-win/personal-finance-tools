import { DateTime } from 'luxon';
import { NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);

	const symbol = searchParams.get('symbol') || '';

	if (!symbol) {
		return NextResponse.json(
			{
				error: 'Symbol is required',
			},
			{ status: 400 }
		);
	}

	try {
		const firstTradedDate = (await yahooFinance.quote(symbol))
			.firstTradeDateMilliseconds!;

		const rates = await yahooFinance.chart(symbol, {
			period1: DateTime.fromJSDate(firstTradedDate).toISODate()!,
			events: '',
		});

		return NextResponse.json(
			rates.quotes
				.filter((quote) => quote.close !== null)
				.map((quote) => ({
					date: DateTime.fromJSDate(quote.date).toISODate()!,
					rate: quote.close,
				}))
		);
	} catch (error) {
		return NextResponse.json(
			{
				error: 'Failed to fetch data',
				details: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
