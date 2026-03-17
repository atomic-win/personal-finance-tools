import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const LOCALE_OPTIONS = [
	'en',
	'en-001',
	'en-029',
	'en-150',
	'en-AG',
	'en-AU',
	'en-BB',
	'en-BM',
	'en-BS',
	'en-BW',
	'en-BZ',
	'en-CA',
	'en-CC',
	'en-CK',
	'en-DM',
	'en-FJ',
	'en-FK',
	'en-GB',
	'en-GD',
	'en-GU',
	'en-HK',
	'en-IE',
	'en-IN',
	'en-JM',
	'en-KN',
	'en-LC',
	'en-MH',
	'en-MP',
	'en-MT',
	'en-NG',
	'en-NZ',
	'en-PH',
	'en-PK',
	'en-PW',
	'en-SG',
	'en-SI',
	'en-TT',
	'en-US',
	'en-VC',
	'en-ZA',
];

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
