/// <reference lib="webworker" />

import { DateTime } from 'luxon';
import type {
	Instrument,
	Return,
	ReturnRequest,
} from '@/features/investment-analysis/lib/types';
import {
	evaluateInstrument,
	getLuxonDuration,
} from '@/features/investment-analysis/lib/utils';

declare const self: DedicatedWorkerGlobalScope;

self.onmessage = (
	event: MessageEvent<{
		instrument: Instrument;
		request: ReturnRequest;
	}>
) => {
	const { instrument, request } = event.data;
	const { investmentDuration } = request;
	const results: Return[] = [];

	const endDate = DateTime.fromISO(instrument.lastDate).minus(
		getLuxonDuration(investmentDuration)
	);
	if (endDate < DateTime.fromISO(instrument.earliestDate)) {
		self.postMessage(results);
		return;
	}

	for (
		let date = DateTime.fromISO(instrument.earliestDate);
		date <= endDate;
		date = date.plus({ days: 1 })
	) {
		results.push({
			instrumentId: instrument.id,
			// biome-ignore lint/style/noNonNullAssertion: We are sure that the date will always be valid as we are controlling the date range and format.
			date: date.plus(getLuxonDuration(investmentDuration)).toISODate()!,
			return: evaluateInstrument(instrument.prices, request, date),
		});
	}

	self.postMessage(results);
};
