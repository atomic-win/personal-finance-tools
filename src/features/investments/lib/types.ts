export enum InstrumentType {
	Unknown = 'Unknown',
	EmergencyFunds = 'EmergencyFunds',
	CashAccounts = 'CashAccounts',
	FixedDeposits = 'FixedDeposits',
	EPF = 'EPF',
	PPF = 'PPF',
	MutualFunds = 'MutualFunds',
	Stocks = 'Stocks',
}

export enum PortfolioType {
	Unknown = 'Unknown',
	Overall = 'Overall',
	PerInvestmentInstrumentType = 'PerInvestmentInstrumentType',
	PerInvestmentInstrument = 'PerInvestmentInstrument',
	PerAsset = 'PerAsset',
}

export type Instrument = {
	id: string;
	name: string;
	type: InstrumentType;
};

export type Asset = {
	id: string;
	name: string;
	instrumentId: string;
};

export type Portfolio = {
	id: string;
	date: string;
	type: PortfolioType;
	investedValue: number;
	investedValuePercent: number;
	currentValue: number;
	currentValuePercent: number;
	xirrPercent: number;
};

export type OverallPortfolio = Portfolio;

export type InstrumentTypePortfolio = Portfolio;

export type InstrumentPortfolio = Portfolio & {
	instrumentName: string;
	instrumentType: InstrumentType;
};

export type AssetPortfolio = Portfolio & {
	assetName: string;
	instrumentId: string;
	instrumentType: InstrumentType;
	instrumentName: string;
};

export enum TransactionType {
	Unknown = 'Unknown',
	Buy = 'Buy',
	Sell = 'Sell',
	Deposit = 'Deposit',
	Withdrawal = 'Withdrawal',
	Dividend = 'Dividend',
	Interest = 'Interest',
	SelfInterest = 'SelfInterest',
	InterestPenalty = 'InterestPenalty',
}

export type Transaction = {
	id: string;
	date: string;
	name: string;
	type: TransactionType;
	assetId: string;
	units: number;
	amount: number;
};

export type Valuation = {
	id: string;
	date: string;
	investedValue: number;
	currentValue: number;
	xirrPercent: number;
};
