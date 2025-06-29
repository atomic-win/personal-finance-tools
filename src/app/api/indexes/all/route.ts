import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

const symbols = [
	'^NSEI', // Nifty 50
	'^NSMIDCP', // Nifty Next 50
	'^NSEMDCP50', // Nifty Midcap 50
	'NIFTY_MIDCAP_100.NS', // Nifty Midcap 100
	'NIFTYMIDCAP150.NS', // Nifty Midcap 150
	'NIFTYSMLCAP50.NS', // Nifty Smallcap 50
	'^CNXSC', // Nifty Smallcap 100
	'NIFTYSMLCAP250.NS', // Nifty Smallcap 250
];

export async function GET() {
	try {
		return NextResponse.json(await Promise.all(symbols.map(getSymbolData)));
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

async function getSymbolData(symbol: string) {
	const symbolData = await yahooFinance.quote(symbol);

	return {
		symbol: symbolData.symbol,
		name:
			symbolData.longName ||
			symbolData.shortName ||
			symbolData.displayName ||
			symbolData.symbol,
	};
}
