import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formattedCurrencyAmount(amount: number) {
	return currencyFormat.format(amount);
}

const currencyFormat = Intl.NumberFormat('en-IN', {
	style: 'currency',
	currency: 'INR',
	currencyDisplay: 'symbol',
	maximumFractionDigits: 2,
	notation: 'compact',
});
