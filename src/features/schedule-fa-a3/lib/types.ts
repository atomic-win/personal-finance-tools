export type Transaction = {
	id: string;
	symbol: string;
	date: string;
	type: 'Buy' | 'Sell';
	units: number;
	price: number;
	remarks: string;
};

export type StockData = {
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
	dailyPrices: { date: string; price: number }[];
	dividends: { date: string; amount: number }[];
};

export type ExchangeRate = {
	date: string;
	rate: number;
};
