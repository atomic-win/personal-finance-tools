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

export interface MutualFundAnalysis {
	isPending: boolean;
	meanXirr: number;
	minXirr: number;
	maxXirr: number;
}

interface MutualFundEvaluation {
	totalInvestment: number;
	totalValue: number;
	xirr: number;
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

export function useXIRRQuery(
	mutualfund: MutualFund,
	lumpsumAmount: number,
	monthlyInvestment: number,
	annualStepUpPercent: number,
	investmentDuration: PresetTimeDurations,
	lookback: PresetTimeDurations
) {
	const dates = getDates(mutualfund, investmentDuration, lookback);

	return useQueries({
		queries: dates.map((date) => ({
			queryKey: [
				'mutualfunds',
				mutualfund.schemeCode,
				'evaluation',
				{
					lumpsumAmount,
					monthlyInvestment,
					annualStepUpPercent,
					investmentDuration,
					date: date.toISODate(),
				},
			],
			queryFn: async () => {
				return calculateXIRR(
					mutualfund,
					lumpsumAmount,
					monthlyInvestment,
					annualStepUpPercent,
					investmentDuration,
					date
				);
			},
			staleTime: 1000 * 60 * 60 * 24, // 24 hours
			refetchInterval: 1000 * 60 * 60 * 24, // 24 hours
			refetchIntervalInBackground: true,
		})),
		combine: (results) => {
			const xirrs = results
				.map((r) => r.data as MutualFundEvaluation)
				.filter((x) => !!x)
				.map((x) => x.xirr);

			return {
				isPending: results.some((r) => r.isPending),
				meanXirr: xirrs.reduce((a, b) => a + b, 0) / Math.max(1, xirrs.length),
				minXirr: xirrs.reduce((a, b) => Math.min(a, b), Infinity),
				maxXirr: xirrs.reduce((a, b) => Math.max(a, b), -Infinity),
			} as MutualFundAnalysis;
		},
	});
}

function getDates(
	mutualfund: MutualFund,
	investmentDuration: PresetTimeDurations,
	lookback: PresetTimeDurations
): DateTime[] {
	const startDate = DateTime.local()
		.minus(getLuxonDuration(lookback))
		.minus(getLuxonDuration(investmentDuration))
		.toISODate();

	if (startDate < mutualfund.earliestDate) {
		return [];
	}

	return [DateTime.fromISO(startDate)];

	const endDate = DateTime.fromISO(mutualfund.lastDate).minus(
		getLuxonDuration(investmentDuration)
	);

	const dates = [];
	for (
		let date = DateTime.fromISO(startDate);
		date <= endDate;
		date = date.plus({ days: 1 })
	) {
		dates.push(date);
	}

	return dates;
}

function calculateXIRR(
	mutualfund: MutualFund,
	lumpsumAmount: number,
	monthlyInvestment: number,
	annualStepUpPercent: number,
	investmentDuration: PresetTimeDurations,
	date: DateTime
): MutualFundEvaluation {
	return {
		totalInvestment: 0,
		totalValue: 0,
		xirr: 200 * Math.random() - 100,
	};
}
