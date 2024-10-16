import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formattedCurrencyAmount(amount: number) {
	return currencyFormat.format(amount);
}

export function formattedYearlyTimeDuration(years: number): string {
	return yearlyTimeDurationFormat.format(years);
}

const currencyFormat = Intl.NumberFormat('en-IN', {
	style: 'currency',
	currency: 'INR',
	currencyDisplay: 'symbol',
	maximumFractionDigits: 2,
	notation: 'compact',
});

const yearlyTimeDurationFormat = new Intl.NumberFormat('en-IN', {
	style: 'unit',
	unit: 'year',
	unitDisplay: 'long',
	maximumFractionDigits: 1,
});
