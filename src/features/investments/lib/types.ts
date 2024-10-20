import { Currency } from '@/lib/types';

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
	initialAmount: number;
	initialAmountPercent: number;
	currentAmount: number;
	currentAmountPercent: number;
	xirrPercent: number;
	currency: Currency;
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
	canEditAsset: boolean;
};
