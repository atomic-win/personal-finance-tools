import { Currency } from '@/lib/types';
import {
	Instrument,
	InstrumentType,
	Asset,
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
	return Intl.NumberFormat('finance', {
		style: 'currency',
		currency: currency,
		currencyDisplay: 'symbol',
		maximumFractionDigits: 0,
		notation: 'standard',
	}).format(amount);
}

export function displayPercentage(percent: number) {
	return Intl.NumberFormat('finance', {
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
