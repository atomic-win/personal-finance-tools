/// <reference lib="webworker" />

import { DateTime } from 'luxon';
import type {
	MutualFund,
	Return,
	ReturnRequest,
} from '@/features/indian-mutual-funds-analysis/lib/types';
import {
	evaluateMutualFund,
	getLuxonDuration,
} from '@/features/indian-mutual-funds-analysis/lib/utils';

declare const self: DedicatedWorkerGlobalScope;

self.onmessage = (
	event: MessageEvent<{
		mutualfund: MutualFund;
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
			schemeCode: mutualfund.schemeCode,
			// biome-ignore lint/style/noNonNullAssertion: We are sure that the date will always be valid as we are controlling the date range and format.
			date: date.plus(getLuxonDuration(investmentDuration)).toISODate()!,
			return: evaluateMutualFund(mutualfund.navs, request, date),
		});
	}

	self.postMessage(results);
};
