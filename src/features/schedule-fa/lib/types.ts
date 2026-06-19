import { z } from 'zod';

// --- CSV Input ---

export const csvRowSchema = z.object({
	Date: z.string(),
	Remarks: z.string().optional(),
	Symbol: z.string().min(1),
	Type: z.enum(['Buy', 'Sell']),
	Units: z.coerce.number().positive(),
	Price: z.coerce.number().nonnegative(),
});

export type CSVRow = z.infer<typeof csvRowSchema>;

// --- Holdings (after parsing / manual entry) ---

export type HoldingInput = {
	id: string;
	symbol: string;
	quantity: number;
	purchaseDate: string;
	purchasePrice: number;
	type: 'Buy' | 'Sell';
};

// --- FIFO Lot ---

export type Lot = {
	symbol: string;
	acquiredOn: string;
	quantity: number;
	purchasePrice: number;
	soldOn: string | null;
	salePrice: number | null;
};

// --- API Responses ---

export type DailyPrice = {
	date: string;
	close: number;
	high: number;
};

export type Dividend = {
	date: string;
	amount: number;
};

export type StockInfoResponse = {
	symbol: string;
	name: string;
	exchange: string;
	currency: string;
	country: string;
	countryCode: string;
	address: string;
	city: string;
	state: string;
	zip: string;
	dailyPrices: DailyPrice[];
	dividends: Dividend[];
};

export type ExchangeRate = {
	date: string;
	rate: number;
};

// --- Schedule FA Output Row ---

export type ScheduleFARow = {
	slNo: number;
	countryNameAndCode: string;
	nameOfEntity: string;
	addressOfEntity: string;
	zipCode: string;
	natureOfEntity: string;
	dateOfAcquiring: string;
	initialValueUSD: number;
	initialValueINR: number;
	peakValueUSD: number;
	peakValueINR: number;
	closingBalanceUSD: number;
	closingBalanceINR: number;
	totalDividendsUSD: number;
	totalDividendsINR: number;
	totalSaleProceedsUSD: number;
	totalSaleProceedsINR: number;
};

// --- Grouping ---

export type GroupingOption =
	| 'none'
	| 'by-stock'
	| 'by-year'
	| 'by-stock-and-year';

// --- Transactions (from CSV) ---

export type Transaction = {
	date: string;
	remarks: string;
	symbol: string;
	type: 'Buy' | 'Sell';
	units: number;
	price: number;
};
