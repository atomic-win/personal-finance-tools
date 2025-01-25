import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function displayCurrencyAmountText(
	locale: string,
	currency: string,
	amount: number,
	notation: 'standard' | 'compact',
	maximumFractionDigits: number
) {
	return Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
		currencyDisplay: 'symbol',
		maximumFractionDigits,
		notation,
	}).format(amount);
}
