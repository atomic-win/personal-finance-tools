import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Currency } from '@/lib/types';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function displayCurrencyAmount(
	currency: Currency,
	amount: number,
	notation: 'standard' | 'compact' = 'standard',
	maximumFractionDigits: number = 2
) {
	return Intl.NumberFormat(navigator.language, {
		style: 'currency',
		currency,
		currencyDisplay: 'symbol',
		maximumFractionDigits,
		notation,
	}).format(amount);
}
