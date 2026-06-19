// --- Transaction (input row — from CSV or manual entry) ---

export type Transaction = {
	id: string;
	symbol: string;
	date: string;
	type: 'Buy' | 'Sell';
	units: number;
	price: number;
	remarks: string;
};

// --- API Responses ---

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
	dailyPrices: { date: string; close: number; high: number }[];
	dividends: { date: string; amount: number }[];
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
	currency: string;
	initialValueForeign: number;
	initialValueINR: number;
	peakValueForeign: number;
	peakValueINR: number;
	closingBalanceForeign: number;
	closingBalanceINR: number;
	totalDividendsForeign: number;
	totalDividendsINR: number;
	totalSaleProceedsForeign: number;
	totalSaleProceedsINR: number;
};

// --- Grouping ---

export type GroupingOption = 'none' | 'by-stock' | 'by-year';
