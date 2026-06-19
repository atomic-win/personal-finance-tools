import { DateTime } from 'luxon';
import { csvRowSchema, type Lot, type Transaction } from './types';

function detectDelimiter(headerLine: string): string {
	const tabCount = (headerLine.match(/\t/g) || []).length;
	const commaCount = (headerLine.match(/,/g) || []).length;
	return tabCount > commaCount ? '\t' : ',';
}

const dateFormats = [
	'yyyy-MM-dd',
	'yyyy/MM/dd',
	'MM-dd-yyyy',
	'MM/dd/yyyy',
	'M/d/yyyy',
	'dd-MM-yyyy',
	'dd/MM/yyyy',
	'd/M/yyyy',
	'dd.MM.yyyy',
];

function normalizeDate(raw: string, rowNum: number): string {
	for (const fmt of dateFormats) {
		const dt = DateTime.fromFormat(raw.trim(), fmt);
		if (dt.isValid) {
			return dt.toISODate() ?? raw;
		}
	}
	// Try ISO parsing as fallback
	const iso = DateTime.fromISO(raw.trim());
	if (iso.isValid) {
		return iso.toISODate() ?? raw;
	}
	throw new Error(`Row ${rowNum}: Unable to parse date "${raw}"`);
}

export function parseCSV(csvText: string): Transaction[] {
	const lines = csvText.trim().split('\n');
	if (lines.length < 2) {
		throw new Error('File must have a header row and at least one data row');
	}

	const delimiter = detectDelimiter(lines[0]);
	const header = lines[0].split(delimiter).map((h) => h.trim());
	const requiredColumns = ['Date', 'Symbol', 'Type', 'Units', 'Price'];
	for (const col of requiredColumns) {
		if (!header.includes(col)) {
			throw new Error(`Missing required column: ${col}`);
		}
	}

	const transactions: Transaction[] = [];

	for (let i = 1; i < lines.length; i++) {
		const line = lines[i].trim();
		if (!line) continue;

		const values = line.split(delimiter).map((v) => v.trim());
		const row: Record<string, string> = {};
		for (let j = 0; j < header.length; j++) {
			row[header[j]] = values[j] ?? '';
		}

		const parsed = csvRowSchema.safeParse(row);
		if (!parsed.success) {
			throw new Error(
				`Row ${i + 1}: ${parsed.error.issues.map((e) => e.message).join(', ')}`
			);
		}

		transactions.push({
			date: normalizeDate(parsed.data.Date, i + 1),
			remarks: parsed.data.Remarks ?? '',
			symbol: parsed.data.Symbol.toUpperCase(),
			type: parsed.data.Type,
			units: parsed.data.Units,
			price: parsed.data.Price,
		});
	}

	return transactions;
}

/**
 * Applies FIFO lot matching to a list of transactions for a single symbol.
 * Returns remaining held lots and sold lots.
 */
export function applyFIFO(transactions: Transaction[]): {
	heldLots: Lot[];
	soldLots: Lot[];
} {
	const sorted = [...transactions].sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
	);

	const buyLots: { date: string; price: number; remaining: number }[] = [];
	const soldLots: Lot[] = [];

	for (const tx of sorted) {
		if (tx.type === 'Buy') {
			buyLots.push({ date: tx.date, price: tx.price, remaining: tx.units });
		} else {
			let unitsToSell = tx.units;
			for (const lot of buyLots) {
				if (unitsToSell <= 0) break;
				if (lot.remaining <= 0) continue;

				const soldFromLot = Math.min(lot.remaining, unitsToSell);
				lot.remaining -= soldFromLot;
				unitsToSell -= soldFromLot;

				soldLots.push({
					symbol: tx.symbol,
					acquiredOn: lot.date,
					quantity: soldFromLot,
					purchasePrice: lot.price,
					soldOn: tx.date,
					salePrice: tx.price,
				});
			}

			if (unitsToSell > 0) {
				throw new Error(
					`Cannot sell ${tx.units} units of ${tx.symbol} on ${tx.date}: insufficient holdings`
				);
			}
		}
	}

	const heldLots: Lot[] = buyLots
		.filter((lot) => lot.remaining > 0)
		.map((lot) => ({
			symbol: sorted[0].symbol,
			acquiredOn: lot.date,
			quantity: lot.remaining,
			purchasePrice: lot.price,
			soldOn: null,
			salePrice: null,
		}));

	return { heldLots, soldLots };
}

/**
 * Groups transactions by symbol and applies FIFO to each.
 */
export function processTransactions(transactions: Transaction[]): {
	heldLots: Lot[];
	soldLots: Lot[];
} {
	const bySymbol = new Map<string, Transaction[]>();
	for (const tx of transactions) {
		const existing = bySymbol.get(tx.symbol) ?? [];
		existing.push(tx);
		bySymbol.set(tx.symbol, existing);
	}

	const allHeldLots: Lot[] = [];
	const allSoldLots: Lot[] = [];

	for (const [, txns] of bySymbol) {
		const { heldLots, soldLots } = applyFIFO(txns);
		allHeldLots.push(...heldLots);
		allSoldLots.push(...soldLots);
	}

	return { heldLots: allHeldLots, soldLots: allSoldLots };
}
