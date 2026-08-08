import { DateTime, type DurationLike } from 'luxon';
import type { Instrument } from '@/features/investment-analysis/lib/types';
import {
	Frequency,
	PresetTimeDurations,
	type ReturnRequest,
	type ReturnType,
	RollingReturnType,
} from '@/features/investment-analysis/lib/types';

export function evaluateInstrument(
	prices: Record<string, number>,
	returnRequest: ReturnRequest,
	date: DateTime
): number {
	const { returnType } = returnRequest;
	switch (returnType) {
		case 'cagr':
			return calculateCagrReturn(prices, returnRequest, date);
		case 'sip':
			return calculateSipReturn(prices, returnRequest, date);
		case 'swp':
			return calculateSwpReturn(prices, returnRequest, date);
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

export function investmentDurationWithReturnTypeText(
	investmentDuration: PresetTimeDurations,
	returnType: ReturnType
) {
	return `${investmentDurationText(investmentDuration)} ${returnTypeText(
		returnType
	)}`;
}

export function returnTypeText(returnType: ReturnType) {
	switch (returnType) {
		case 'cagr':
			return 'CAGR (%)';
		case 'sip':
			return 'SIP XIRR (%)';
		case 'swp':
			return 'SWP XIRR (%)';
		default:
			throw new Error('Invalid return type');
	}
}

export function investmentDurationText(
	investmentDuration: PresetTimeDurations
) {
	switch (investmentDuration) {
		case PresetTimeDurations.OneMonth:
			return '1-month';
		case PresetTimeDurations.TwoMonths:
			return '2-month';
		case PresetTimeDurations.ThreeMonths:
			return '3-month';
		case PresetTimeDurations.SixMonths:
			return '6-month';
		case PresetTimeDurations.OneYear:
			return '1-year';
		case PresetTimeDurations.TwoYears:
			return '2-year';
		case PresetTimeDurations.ThreeYears:
			return '3-year';
		case PresetTimeDurations.FiveYears:
			return '5-year';
		case PresetTimeDurations.TenYears:
			return '10-year';
		case PresetTimeDurations.FifteenYears:
			return '15-year';
		case PresetTimeDurations.TwentyYears:
			return '20-year';
		default:
			throw new Error('Invalid investment duration');
	}
}

export function rollingReturnTypeText(rollingReturnType: RollingReturnType) {
	switch (rollingReturnType) {
		case RollingReturnType.Min:
			return 'Minimum';
		case RollingReturnType.Max:
			return 'Maximum';
		case RollingReturnType.Avg:
			return 'Average';
		case RollingReturnType.P25:
			return '25th Percentile';
		case RollingReturnType.P50:
			return '50th Percentile';
		case RollingReturnType.P75:
			return '75th Percentile';
		case RollingReturnType.P90:
			return '90th Percentile';
		default:
			throw new Error('Invalid rolling return type');
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

function calculateCagrReturn(
	prices: Record<string, number>,
	returnRequest: ReturnRequest,
	date: DateTime
) {
	const { investmentDuration } = returnRequest;
	const endDate = date
		.plus(getLuxonDuration(investmentDuration))
		.minus({ days: 1 });

	return (
		100 *
		// biome-ignore lint/style/noNonNullAssertion: We are sure that the NAVs for the start and end dates will always be available as we are controlling the date range through the investment duration and the available NAV data.
		((prices[endDate.toISODate()!]! / prices[date.toISODate()!]!) **
			(1 / Math.max(1, endDate.diff(date, 'years')?.years)) -
			1)
	);
}

function calculateSipReturn(
	prices: Record<string, number>,
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
		let currentDate = startDate;
		currentDate < endDate;
		currentDate = currentDate.plus(frequencyDuration)
	) {
		if (currentDate > stepUpDate) {
			investmentAmount *= 1 + stepUpRatio;
			stepUpDate = stepUpDate.plus(
				getLuxonDurationForFrequency(stepUpFrequency)
			);
		}

		// biome-ignore lint/style/noNonNullAssertion: We are sure that the NAVs for the current date will always be available as we are controlling the date range through the investment duration and the available NAV data.
		totalUnits += investmentAmount / prices[currentDate.toISODate()!]!;

		xirrInputs.push({
			years: endDate.diff(currentDate, 'years')?.years ?? 0,
			amount: investmentAmount,
		});
	}

	xirrInputs.push({
		years: 0,
		// biome-ignore lint/style/noNonNullAssertion: We are sure that the NAVs for the end date will always be available as we are controlling the date range through the investment duration and the available NAV data.
		amount: -totalUnits * prices[endDate.toISODate()!]!,
	});

	return calculateXIRR(xirrInputs);
}

function calculateSwpReturn(
	prices: Record<string, number>,
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

		// biome-ignore lint/style/noNonNullAssertion: We are sure that the NAVs for the current date will always be available as we are controlling the date range through the investment duration and the available NAV data.
		totalUnits += investmentAmount / prices[currentDate.toISODate()!]!;

		xirrInputs.push({
			years: endDate.diff(currentDate, 'years')?.years ?? 0,
			amount: -investmentAmount,
		});
	}

	xirrInputs.push({
		years: endDate.diff(startDate, 'years')?.years ?? 0,
		// biome-ignore lint/style/noNonNullAssertion: We are sure that the NAVs for the start date will always be available as we are controlling the date range through the investment duration and the available NAV data.
		amount: totalUnits * prices[startDate.toISODate()!]!,
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
	let xirrHigh = 2;

	while (xirrHigh - xirrLow > 1e-6) {
		const xirrGuess = (xirrLow + xirrHigh) / 2;
		const npv = xirrInputs.reduce(
			(acc, input) => acc + input.amount * (1 + xirrGuess) ** input.years,
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

export function buildDailySeries(rawPrices: Record<string, number>): {
	earliestDate: string;
	lastDate: string;
	prices: Record<string, number>;
} {
	const dates = Object.keys(rawPrices).sort();

	if (dates.length === 0) {
		const today = DateTime.local().toISODate() ?? '';
		return { earliestDate: today, lastDate: today, prices: {} };
	}

	const earliestDate = dates[0];
	const lastDate = dates[dates.length - 1];
	const prices: Record<string, number> = {};

	let lastKnownPrice = rawPrices[earliestDate];

	for (
		let date = earliestDate;
		date <= lastDate;
		date = DateTime.fromISO(date).plus({ days: 1 }).toISODate() ?? lastDate
	) {
		if (rawPrices[date] !== undefined) {
			lastKnownPrice = rawPrices[date];
		}

		prices[date] = lastKnownPrice;

		if (date === lastDate) {
			break;
		}
	}

	return { earliestDate, lastDate, prices };
}

export function convertInstrumentCurrency(
	instrument: Instrument,
	fxRates: Record<string, number>,
	targetCurrency: string
): Instrument {
	if (instrument.currency === targetCurrency) {
		return instrument;
	}

	const prices: Record<string, number> = {};
	const dates = Object.keys(instrument.prices).sort();
	let lastKnownRate: number | undefined;

	for (const date of dates) {
		lastKnownRate = fxRates[date] ?? lastKnownRate;

		if (lastKnownRate) {
			prices[date] = instrument.prices[date] * lastKnownRate;
		}
	}

	const convertedDates = Object.keys(prices);

	return {
		...instrument,
		currency: targetCurrency,
		earliestDate: convertedDates[0] ?? instrument.lastDate,
		lastDate: convertedDates[convertedDates.length - 1] ?? instrument.lastDate,
		prices,
	};
}
