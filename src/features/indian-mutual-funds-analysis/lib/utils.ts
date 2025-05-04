import {
	Frequency,
	PresetTimeDurations,
	ReturnRequest,
} from '@/features/indian-mutual-funds-analysis/lib/types';
import { DateTime, DurationLike } from 'luxon';

export function evaluateMutualFund(
	navs: Map<string, number>,
	returnRequest: ReturnRequest,
	date: DateTime
): number {
	const { investmentDuration } = returnRequest;
	const endDate = date
		.plus(getLuxonDuration(investmentDuration))
		.minus({ days: 1 });

	return (
		100 *
		(Math.pow(
			navs.get(endDate.toISODate()!)! / navs.get(date.toISODate()!)!,
			1 / Math.max(1, endDate.diff(date, 'years')!.years)
		) -
			1)
	);
}

export function displayFrequency(frequency: Frequency) {
	switch (frequency) {
		case Frequency.Weekly:
			return 'Weekly';
		case Frequency.Biweekly:
			return 'Bi-Weekly';
		case Frequency.Monthly:
			return 'Monthly';
		case Frequency.Quarterly:
			return 'Quarterly';
		case Frequency.Yearly:
			return 'Yearly';
		default:
			throw new Error('Invalid frequency');
	}
}

export function displayPresetTimeDuration(
	duration: PresetTimeDurations
): string {
	switch (duration) {
		case PresetTimeDurations.OneMonth:
			return '1 month';
		case PresetTimeDurations.TwoMonths:
			return '2 months';
		case PresetTimeDurations.ThreeMonths:
			return '3 months';
		case PresetTimeDurations.SixMonths:
			return '6 months';
		case PresetTimeDurations.OneYear:
			return '1 year';
		case PresetTimeDurations.TwoYears:
			return '2 years';
		case PresetTimeDurations.ThreeYears:
			return '3 years';
		case PresetTimeDurations.FiveYears:
			return '5 years';
		case PresetTimeDurations.TenYears:
			return '10 years';
		case PresetTimeDurations.FifteenYears:
			return '15 years';
		case PresetTimeDurations.TwentyYears:
			return '20 years';
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
