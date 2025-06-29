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
		const symbolData = await yahooFinance.quote(symbol);

		const rates = await yahooFinance.chart(symbol, {
			period1: DateTime.fromJSDate(
				symbolData.firstTradeDateMilliseconds!
			).toISODate()!,
			events: '',
		});

		return NextResponse.json({
			symbol: symbolData.symbol,
			name:
				symbolData.longName ||
				symbolData.shortName ||
				symbolData.displayName ||
				symbolData.symbol,
			data: rates.quotes
				.filter((quote) => quote.close !== null)
				.map((quote) => ({
					date: DateTime.fromJSDate(quote.date).toISODate()!,
					rate: quote.close,
				})),
		});
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
