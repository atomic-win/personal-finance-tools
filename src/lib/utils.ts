import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PresetTimeDurations } from './types';
import { DurationLike } from 'luxon';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function displayCurrencyAmount(amount: number) {
	return currencyFormat.format(amount);
}

export function displayYearlyTimeDuration(years: number): string {
	return yearlyTimeDurationFormat.format(years);
}

export function displayPresetTimeDuration(
	duration: PresetTimeDurations
): string {
	switch (duration) {
		case PresetTimeDurations.OneMonth:
			return '1 Month';
		case PresetTimeDurations.TwoMonths:
			return '2 Months';
		case PresetTimeDurations.ThreeMonths:
			return '3 Months';
		case PresetTimeDurations.SixMonths:
			return '6 Months';
		case PresetTimeDurations.OneYear:
			return '1 Year';
		case PresetTimeDurations.TwoYears:
			return '2 Years';
		case PresetTimeDurations.ThreeYears:
			return '3 Years';
		case PresetTimeDurations.FiveYears:
			return '5 Years';
		case PresetTimeDurations.TenYears:
			return '10 Years';
		case PresetTimeDurations.FifteenYears:
			return '15 Years';
		case PresetTimeDurations.TwentyYears:
			return '20 Years';
	}
}

export function getLuxonDuration(duration: PresetTimeDurations): DurationLike {
	switch (duration) {
		case PresetTimeDurations.OneMonth:
			return { months: 1 };
		case PresetTimeDurations.TwoMonths:
			return { months: 2 };
		case PresetTimeDurations.ThreeMonths:
			return { months: 3 };
		case PresetTimeDurations.SixMonths:
			return { months: 6 };
		case PresetTimeDurations.OneYear:
			return { years: 1 };
		case PresetTimeDurations.TwoYears:
			return { years: 2 };
		case PresetTimeDurations.ThreeYears:
			return { years: 3 };
		case PresetTimeDurations.FiveYears:
			return { years: 5 };
		case PresetTimeDurations.TenYears:
			return { years: 10 };
		case PresetTimeDurations.FifteenYears:
			return { years: 15 };
		case PresetTimeDurations.TwentyYears:
			return { years: 20 };
	}
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
