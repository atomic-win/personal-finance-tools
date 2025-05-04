import {
	MutualFund,
	Return,
	RollingReturn,
	PresetTimeDurations,
	ReturnRequest,
} from '@/features/indian-mutual-funds-analysis/lib/types';
import {
	evaluateMutualFund,
	getLuxonDuration,
} from '@/features/indian-mutual-funds-analysis/lib/utils';
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
			return (await mfApiClient.get('mf')).data as MutualFund[];
		},
		select: (data) => _.uniqBy(data, (mf) => mf.schemeCode),
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
				const navs = new Map<string, number>();

				let earliestDate = DateTime.local().toISODate();
				let lastDate = DateTime.local().minus({ months: 1 }).toISODate();

				apiResponse.data.forEach((x) => {
					const date = DateTime.fromFormat(x.date, 'dd-MM-yyyy').toISODate()!;

					navs.set(date, x.nav);

					if (date < earliestDate) {
						earliestDate = date;
					}

					if (date > lastDate) {
						lastDate = date;
					}
				});

				let latestNav = navs.get(lastDate)!;
				for (
					let date = lastDate;
					earliestDate <= date;
					date = DateTime.fromISO(date).minus({ days: 1 }).toISODate()!
				) {
					if (!navs.has(date)) {
						navs.set(date, latestNav);
					} else {
						latestNav = navs.get(date)!;
					}
				}

				return {
					schemeCode,
					schemeName,
					earliestDate,
					lastDate,
					navs,
				} as MutualFund;
			},
			staleTime: 1000 * 60 * 60, // 1 hour
			refetchInterval: 1000 * 60 * 60, // 1 hour
			refetchIntervalInBackground: true,
		})),
	});
}

export function useReturnQueries(
	request: ReturnRequest & {
		mutualfunds: MutualFund[];
		lookbackDuration: PresetTimeDurations;
	}
) {
	const { mutualfunds, lookbackDuration } = request;
	const earliestDate = DateTime.min(
		...mutualfunds.map((mf) => DateTime.fromISO(mf.lastDate)),
		DateTime.local()
	)
		.minus(getLuxonDuration(lookbackDuration))
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
						schemeCode: mutualfund.schemeCode,
					})),
		})),
	});
}

export function useRollingReturnQuery(
	request: ReturnRequest & {
		mutualfund: MutualFund;
	}
) {
	const { mutualfund, investmentDuration: returnWindow } = request;

	return useQuery({
		...createReturnsQuery({
			...request,
			lookbackDuration: request.investmentDuration,
		}),
		select: (returns: Return[]) => {
			const startDate = DateTime.fromISO(mutualfund.lastDate)
				.minus(getLuxonDuration(returnWindow))
				.plus({ days: 1 });

			const a = returns
				.filter((r) => DateTime.fromISO(r.date) >= startDate)
				.map((r) => r.return);

			return {
				noData: a.length === 0,
				avgReturn: a.reduce((x, y) => x + y, 0) / Math.max(1, a.length),
				minReturn: a.reduce((x, y) => Math.min(x, y), Infinity),
				maxReturn: a.reduce((x, y) => Math.max(x, y), -Infinity),
			} as RollingReturn;
		},
	});
}

function createReturnsQuery(
	request: ReturnRequest & {
		mutualfund: MutualFund;
		lookbackDuration: PresetTimeDurations;
	}
) {
	const {
		mutualfund,
		lookbackDuration,
		investmentDuration: returnWindow,
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
			mutualfund.schemeCode,
			'returns',
			{
				lookbackDuration,
				returnWindow,
				returnType,
				frequency,
				stepUpFrequency,
				stepUpRatio,
			},
		],
		queryFn: async () => {
			const endDate = DateTime.fromISO(mutualfund.lastDate).minus(
				getLuxonDuration(returnWindow)
			);

			if (endDate < DateTime.fromISO(mutualfund.earliestDate)) {
				return [];
			}

			const startDate = DateTime.max(
				DateTime.fromISO(mutualfund.earliestDate),
				endDate.minus(getLuxonDuration(lookbackDuration)).plus({ days: 1 })
			);

			const returns = [];
			for (
				let date = startDate;
				date <= endDate;
				date = date.plus({ days: 1 })
			) {
				returns.push({
					date: date.plus(getLuxonDuration(returnWindow)).toISODate()!,
					return: evaluateMutualFund(mutualfund.navs, request, date),
				});
			}

			return returns as Return[];
		},
		select: (returns: Return[]) =>
			returns.map((r) => ({
				...r,
				schemeCode: mutualfund.schemeCode,
			})),
		staleTime: 1000 * 60 * 60, // 1 hour
		refetchInterval: 1000 * 60 * 60, // 1 hour
		refetchIntervalInBackground: true,
	};
}
