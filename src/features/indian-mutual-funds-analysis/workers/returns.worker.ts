/// <reference lib="webworker" />
import {
	Instrument,
	Return,
	ReturnRequest,
} from '@/features/indian-mutual-funds-analysis/lib/types';
import {
	getLuxonDuration,
	evaluateMutualFund,
} from '@/features/indian-mutual-funds-analysis/lib/utils';
import { DateTime } from 'luxon';

declare const self: DedicatedWorkerGlobalScope;

self.onmessage = (
	event: MessageEvent<{
		mutualfund: Instrument;
		request: ReturnRequest;
	}>
) => {
	const { mutualfund, request } = event.data;
	const { investmentDuration } = request;
	const results: Return[] = [];

	const endDate = DateTime.fromISO(mutualfund.lastDate).minus(
		getLuxonDuration(investmentDuration)
	);
	if (endDate < DateTime.fromISO(mutualfund.earliestDate)) {
		self.postMessage(results);
		return;
	}

	for (
		let date = DateTime.fromISO(mutualfund.earliestDate);
		date <= endDate;
		date = date.plus({ days: 1 })
	) {
		results.push({
			symbol: mutualfund.symbol,
			date: date.plus(getLuxonDuration(investmentDuration)).toISODate()!,
			return: evaluateMutualFund(mutualfund.rates, request, date),
		});
	}

	self.postMessage(results);
};
