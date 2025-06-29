/// <reference lib="webworker" />
import {
	Instrument,
	Return,
	ReturnRequest,
} from '@/features/indian-mutual-funds-analysis/lib/types';
import {
	getLuxonDuration,
	evaluateInstrument,
} from '@/features/indian-mutual-funds-analysis/lib/utils';
import { DateTime } from 'luxon';

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
			symbol: instrument.symbol,
			date: date.plus(getLuxonDuration(investmentDuration)).toISODate()!,
			return: evaluateInstrument(instrument.rates, request, date),
		});
	}

	self.postMessage(results);
};
