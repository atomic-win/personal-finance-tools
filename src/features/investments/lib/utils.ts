import { Currency } from '@/lib/types';

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
