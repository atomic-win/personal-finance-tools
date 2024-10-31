import { Currency } from '@/lib/types';
import {
	Instrument,
	InstrumentType,
	Asset,
	PortfolioType,
	TransactionType,
	Valuation,
	Portfolio,
} from '@/features/investments/lib/types';

export function findInstrumentById(
	instruments: Instrument[],
	id: string
): Instrument | undefined {
	return (instruments || []).find((instrument) => instrument.id === id);
}

export function findAssetById(assets: Asset[], id: string): Asset | undefined {
	return (assets || []).find((asset) => asset.id === id);
}

export function displayCurrencyAmount(currency: Currency, amount: number) {
	return Intl.NumberFormat('en-IN', {
		style: 'currency',
		currency: currency,
		currencyDisplay: 'symbol',
		maximumFractionDigits: 2,
		notation: 'compact',
	}).format(amount);
}

export function displayPercentage(percent: number) {
	return Intl.NumberFormat('en-IN', {
		style: 'percent',
		maximumFractionDigits: 2,
	}).format(percent / 100);
}

export function displayInstrumentType(instrumentType: InstrumentType): string {
	switch (instrumentType) {
		case InstrumentType.EmergencyFunds:
			return 'Emergency Fund';
		case InstrumentType.CashAccounts:
			return 'Cash Account';
		case InstrumentType.FixedDeposits:
			return 'Fixed Deposit';
		case InstrumentType.EPF:
			return 'Employee Provident Fund';
		case InstrumentType.PPF:
			return 'Public Provident Fund';
		case InstrumentType.MutualFunds:
			return 'Mutual Fund';
		case InstrumentType.Stocks:
			return 'Stock';
		default:
			return 'Unknown';
	}
}

export function displayPortfolioType(portfolioType: PortfolioType): string {
	switch (portfolioType) {
		case PortfolioType.Overall:
			return 'Overall';
		case PortfolioType.PerInvestmentInstrumentType:
			return 'Per Instrument Type';
		case PortfolioType.PerInvestmentInstrument:
			return 'Per Instrument';
		case PortfolioType.PerAsset:
			return 'Per Asset';
		default:
			throw new Error(`Unknown portfolio type: ${portfolioType}`);
	}
}

export function displayTransactionType(transactionType: TransactionType) {
	switch (transactionType) {
		case TransactionType.Buy:
			return 'Buy';
		case TransactionType.Sell:
			return 'Sell';
		case TransactionType.Deposit:
			return 'Deposit';
		case TransactionType.Withdrawal:
			return 'Withdrawal';
		case TransactionType.Dividend:
			return 'Dividend';
		case TransactionType.Interest:
			return 'Interest';
		case TransactionType.SelfInterest:
			return 'Self Interest';
		case TransactionType.InterestPenalty:
			return 'Interest Penalty';
		default:
			throw new Error(`Unknown transaction type: ${transactionType}`);
	}
}

export function displayTransactionAmount(currency: Currency, amount: number) {
	return Intl.NumberFormat('en-IN', {
		style: 'currency',
		currency: currency,
		currencyDisplay: 'symbol',
	}).format(amount);
}

export function calculatePortfolios(valuations: Valuation[]): Portfolio[] {
	const dateToValuations = new Map<string, Valuation[]>();

	for (const valuation of valuations) {
		if (
			valuation.investedValue === 0 &&
			valuation.currentValue === 0 &&
			valuation.xirrPercent === 0
		) {
			continue;
		}
		const valuations = dateToValuations.get(valuation.date) || [];
		valuations.push(valuation);
		dateToValuations.set(valuation.date, valuations);
	}

	return Array.from(dateToValuations.values()).flatMap((valuations) => {
		return calculatePortfolio(valuations);
	});
}

function calculatePortfolio(valuations: Valuation[]): Portfolio[] {
	const totalInvestedValue = valuations.reduce((sum, valuation) => {
		return sum + valuation.investedValue;
	}, 0);

	const totalCurrentValue = valuations.reduce((sum, valuation) => {
		return sum + valuation.currentValue;
	}, 0);

	return valuations.map((valuation) => {
		return {
			id: valuation.id,
			date: valuation.date,
			type: PortfolioType.Unknown,
			investedValue: valuation.investedValue,
			investedValuePercent:
				(valuation.investedValue / Math.max(totalInvestedValue, 1)) * 100,
			currentValue: valuation.currentValue,
			currentValuePercent:
				(valuation.currentValue / Math.max(totalCurrentValue, 1)) * 100,
			xirrPercent: valuation.xirrPercent,
		};
	});
}
