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
	const { returnType } = returnRequest;
	switch (returnType) {
		case 'simple':
			return pointToPointReturn(navs, returnRequest, date);
		case 'swp':
			return swpReturn(navs, returnRequest, date);
		default:
			throw new Error('Invalid return type');
	}
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

function pointToPointReturn(
	navs: Map<string, number>,
	returnRequest: ReturnRequest,
	date: DateTime
) {
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

function swpReturn(
	navs: Map<string, number>,
	returnRequest: ReturnRequest,
	date: DateTime
) {
	const { investmentDuration, frequency, stepUpFrequency, stepUpRatio } =
		returnRequest;

	const startDate = date;
	const endDate = date.plus(getLuxonDuration(investmentDuration));
	const frequencyDuration = getLuxonDurationForFrequency(frequency);

	const xirrInputs: { years: number; amount: number }[] = [];

	let totalUnits = 0;
	let investmentAmount = 1;
	let stepUpDate = startDate.plus(
		getLuxonDurationForFrequency(stepUpFrequency)
	);

	for (
		let currentDate = startDate.plus(frequencyDuration);
		currentDate <= endDate;
		currentDate = currentDate.plus(frequencyDuration)
	) {
		if (currentDate > stepUpDate) {
			investmentAmount *= 1 + stepUpRatio;
			stepUpDate = stepUpDate.plus(
				getLuxonDurationForFrequency(stepUpFrequency)
			);
		}

		totalUnits += investmentAmount / navs.get(currentDate.toISODate()!)!;

		xirrInputs.push({
			years: endDate.diff(currentDate, 'years')!.years,
			amount: -investmentAmount,
		});
	}

	xirrInputs.push({
		years: endDate.diff(startDate, 'years')!.years,
		amount: totalUnits * navs.get(startDate.toISODate()!)!,
	});

	return calculateXIRR(xirrInputs);
}

function calculateXIRR(
	xirrInputs: { years: number; amount: number }[]
): number {
	if (
		xirrInputs.length === 0 ||
		xirrInputs.every((input) => input.amount === 0)
	) {
		return 0;
	}

	if (xirrInputs.every((input) => input.years <= 1)) {
		const inflow = xirrInputs
			.filter((input) => input.amount > 0)
			.reduce((acc, input) => acc + input.amount, 0);

		const outflow = -xirrInputs
			.filter((input) => input.amount < 0)
			.reduce((acc, input) => acc + input.amount, 0);

		return 100 * (outflow / inflow - 1);
	}

	let xirrLow = -1;
	let xirrHigh = 1;

	while (xirrHigh - xirrLow > 1e-6) {
		const xirrGuess = (xirrLow + xirrHigh) / 2;
		const npv = xirrInputs.reduce(
			(acc, input) => acc + input.amount * Math.pow(1 + xirrGuess, input.years),
			0
		);

		if (npv >= 0) {
			xirrHigh = xirrGuess;
		} else {
			xirrLow = xirrGuess;
		}
	}

	return (100 * (xirrLow + xirrHigh)) / 2;
}

function getLuxonDurationForFrequency(frequency: Frequency): DurationLike {
	switch (frequency) {
		case Frequency.Weekly:
			return { weeks: 1 };
		case Frequency.Biweekly:
			return { weeks: 2 };
		case Frequency.Monthly:
			return { months: 1 };
		case Frequency.Quarterly:
			return { months: 3 };
		case Frequency.Yearly:
			return { years: 1 };
	}
}
