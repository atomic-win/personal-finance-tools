import {
	Instrument,
	Return,
	ReturnRequest,
} from '@/features/indian-mutual-funds-analysis/lib/types';
import { getLuxonDuration } from '@/features/indian-mutual-funds-analysis/lib/utils';
import { useQueries, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { DateTime } from 'luxon';
import _ from 'lodash';

const mfApiClient = axios.create({
	baseURL: 'https://api.mfapi.in',
	validateStatus: () => true,
});

export function useMutualFundListQuery() {
	return useQuery({
		queryKey: ['mutualfunds', 'list'],
		queryFn: async () => {
			return (await mfApiClient.get('mf')).data;
		},
		select: (data) => {
			const mutualFunds = (
				data as {
					schemeCode: number;
					schemeName: string;
				}[]
			).map(
				(x) =>
					({
						symbol: x.schemeCode.toString(),
						name: x.schemeName,
					} as Instrument)
			);

			return _.sortBy(mutualFunds, (x) => x.symbol);
		},
		staleTime: 1000 * 60 * 60 * 24, // 24 hours
		refetchInterval: 1000 * 60 * 60 * 24, // 24 hours
		refetchIntervalInBackground: true,
	});
}

export function useMutualFundQueries(schemeCodes: number[]) {
	return useQueries({
		queries: schemeCodes.map((schemeCode) => ({
			queryKey: ['mutualfunds', schemeCode],
			queryFn: async () => {
				return (await mfApiClient.get(`mf/${schemeCode}`)).data;
			},
			select: (apiResponse: {
				meta: { scheme_code: number; scheme_name: string };
				data: { date: string; nav: number }[];
			}) => {
				const schemeCode = apiResponse.meta.scheme_code;
				const schemeName = apiResponse.meta.scheme_name;
				const rates = new Map<string, number>();

				let earliestDate = DateTime.local().toISODate();
				let lastDate = DateTime.local().minus({ months: 1 }).toISODate();

				apiResponse.data.forEach((x) => {
					const date = DateTime.fromFormat(x.date, 'dd-MM-yyyy').toISODate()!;

					rates.set(date, x.nav);

					if (date < earliestDate) {
						earliestDate = date;
					}

					if (date > lastDate) {
						lastDate = date;
					}
				});

				let latestNav = rates.get(lastDate)!;
				for (
					let date = lastDate;
					earliestDate <= date;
					date = DateTime.fromISO(date).minus({ days: 1 }).toISODate()!
				) {
					if (!rates.has(date)) {
						rates.set(date, latestNav);
					} else {
						latestNav = rates.get(date)!;
					}
				}

				return {
					symbol: schemeCode.toString(),
					name: schemeName,
					earliestDate,
					lastDate,
					rates,
				} as Instrument;
			},
			staleTime: 1000 * 60 * 60, // 1 hour
			refetchInterval: 1000 * 60 * 60, // 1 hour
			refetchIntervalInBackground: true,
		})),
	});
}

export function useReturnQueries(
	request: ReturnRequest & {
		mutualfunds: Instrument[];
	}
) {
	const { mutualfunds, rollingWindow } = request;
	const earliestDate = DateTime.min(
		...mutualfunds.map((mf) => DateTime.fromISO(mf.lastDate)),
		DateTime.local()
	)
		.minus(getLuxonDuration(rollingWindow))
		.plus({ days: 1 });

	return useQueries({
		queries: mutualfunds.map((mutualfund) => ({
			...createReturnsQuery({
				...request,
				mutualfund,
			}),
			select: (returns: Return[]) =>
				returns
					.filter((r) => DateTime.fromISO(r.date) >= earliestDate)
					.map((r) => ({
						...r,
						schemeCode: mutualfund.symbol,
					})),
		})),
	});
}

export function useRollingReturnsQuery(
	request: ReturnRequest & {
		mutualfund: Instrument;
	}
) {
	return useQuery({
		...createReturnsQuery({
			...request,
		}),
		select: (returns: Return[]) => {
			const startDate = DateTime.fromISO(request.mutualfund.lastDate)
				.minus(getLuxonDuration(request.rollingWindow))
				.plus({ days: 1 });

			const a = returns
				.filter((r) => DateTime.fromISO(r.date) >= startDate)
				.map((r) => r.return);

			const totalDays = DateTime.fromISO(request.mutualfund.lastDate).diff(
				startDate,
				'days'
			).days;

			const availableDays = a.length;
			const shouldUseData = availableDays / Math.max(1, totalDays) >= 0.9;

			return shouldUseData ? a : [];
		},
	});
}

function createReturnsQuery(
	request: ReturnRequest & {
		mutualfund: Instrument;
	}
) {
	const {
		mutualfund,
		investmentDuration,
		returnType,
		frequency,
		stepUpFrequency,
		stepUpRatio,
	} = request;

	if (!!!returnType) {
		throw new Error('Return type is required');
	}

	if (
		returnType === 'swp' &&
		(!frequency || !stepUpFrequency || stepUpRatio < 0)
	) {
		throw new Error(
			'Frequency and step up frequency/ratio are required for SWP returns'
		);
	}

	return {
		queryKey: [
			'mutualfunds',
			mutualfund.symbol,
			'returns',
			{
				investmentDuration,
				returnType,
				frequency,
				stepUpFrequency,
				stepUpRatio,
			},
		],
		queryFn: async (): Promise<Return[]> => {
			return new Promise((resolve, reject) => {
				const worker = new Worker(
					new URL('../workers/returns.worker.ts', import.meta.url)
				);

				worker.onmessage = (event: MessageEvent<Return[]>) => {
					resolve(event.data);
					worker.terminate();
				};

				worker.onerror = (error: ErrorEvent) => {
					reject(error.message);
					worker.terminate();
				};

				worker.postMessage({ mutualfund, request });
			});
		},
		staleTime: 1000 * 60 * 60, // 1 hour
		refetchInterval: 1000 * 60 * 60, // 1 hour
		refetchIntervalInBackground: true,
	};
}
