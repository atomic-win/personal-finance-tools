import { PresetTimeDurations } from '@/lib/types';
import { getLuxonDuration } from '@/lib/utils';
import { useQueries, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { DateTime } from 'luxon';

export interface MutualFund {
	schemeCode: number;
	schemeName: string;
	earliestDate: string;
	lastDate: string;
	navs: Map<string, number>;
}

export interface MutualFundRollingReturns {
	noData: boolean;
	avgReturn: number;
	minReturn: number;
	maxReturn: number;
}

export interface MutualFundReturn {
	schemeCode: number;
	date: string;
	return: number;
}

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
		select: (data) => data as MutualFund[],
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
	mutualfunds: MutualFund[],
	investmentDuration: PresetTimeDurations,
	lookbackDuration: PresetTimeDurations
) {
	const earliestDate = DateTime.max(
		...mutualfunds.map((mf) => DateTime.fromISO(mf.earliestDate))
	);

	return useQueries({
		queries: mutualfunds.map((mutualfund) => ({
			queryKey: [
				'mutualfunds',
				mutualfund.schemeCode,
				'returns',
				{ investmentDuration, lookbackDuration },
			],
			queryFn: async () => {
				const endDate = DateTime.fromISO(mutualfund.lastDate).minus(
					getLuxonDuration(investmentDuration)
				);

				const startDate = endDate
					.minus(getLuxonDuration(lookbackDuration))
					.plus({ days: 1 });

				const returns: MutualFundReturn[] = [];
				for (
					let date = DateTime.max(startDate, earliestDate);
					date <= endDate;
					date = date.plus({ days: 1 })
				) {
					returns.push({
						schemeCode: 0,
						date: date.plus(getLuxonDuration(investmentDuration)).toISODate()!,
						return: evaluateMutualFund(
							mutualfund.navs,
							investmentDuration,
							date
						),
					});
				}

				return returns;
			},
			select: (returns: MutualFundReturn[]) =>
				returns.map((r) => ({
					...r,
					schemeCode: mutualfund.schemeCode,
				})),
			staleTime: 1000 * 60 * 60, // 1 hour
			refetchInterval: 1000 * 60 * 60, // 1 hour
			refetchIntervalInBackground: true,
		})),
	});
}

export function useRollingReturnsQuery(
	mutualfund: MutualFund,
	rollingWindow: PresetTimeDurations
) {
	return useQuery({
		queryKey: [
			'mutualfunds',
			mutualfund.schemeCode,
			'rolling-returns',
			{
				rollingWindow,
			},
		],
		queryFn: async () => {
			const endDate = DateTime.fromISO(mutualfund.lastDate).minus(
				getLuxonDuration(rollingWindow)
			);

			const startDate = endDate
				.minus(getLuxonDuration(rollingWindow))
				.plus({ days: 1 });

			const returns = [];
			for (
				let date = DateTime.max(
					startDate,
					DateTime.fromISO(mutualfund.earliestDate)
				);
				date <= endDate;
				date = date.plus({ days: 1 })
			) {
				returns.push(evaluateMutualFund(mutualfund.navs, rollingWindow, date));
			}

			return returns;
		},
		select: (returns) =>
			({
				noData: returns.length === 0,
				avgReturn:
					returns.reduce((a, b) => a + b, 0) / Math.max(1, returns.length),
				minReturn: returns.reduce((a, b) => Math.min(a, b), Infinity),
				maxReturn: returns.reduce((a, b) => Math.max(a, b), -Infinity),
			} as MutualFundRollingReturns),
		staleTime: 1000 * 60 * 60 * 24, // 24 hours
		refetchInterval: 1000 * 60 * 60 * 24, // 24 hours
		refetchIntervalInBackground: true,
	});
}

function evaluateMutualFund(
	navs: Map<string, number>,
	investmentDuration: PresetTimeDurations,
	date: DateTime
): number {
	const endDate = date
		.plus(getLuxonDuration(investmentDuration))
		.minus({ days: 1 });

	return (
		100 *
		(Math.pow(
			navs.get(endDate.toISODate()!)! / navs.get(date.toISODate()!)!,
			1 / endDate.diff(date, 'years')!.years
		) -
			1)
	);
}
