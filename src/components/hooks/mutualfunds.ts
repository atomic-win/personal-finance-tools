import { useQueries, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { DateTime } from 'luxon';

export interface MutualFund {
	schemeCode: number;
	schemeName: string;
	startDate: string;
	lastDate: string;
	navs: Map<string, number>;
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

				let startDate = DateTime.local().toISODate();
				let lastDate = DateTime.local().minus({ months: 1 }).toISODate();

				apiResponse.data.forEach((x) => {
					const date = DateTime.fromFormat(x.date, 'dd-MM-yyyy').toISODate()!;

					navs.set(date, x.nav);

					if (date < startDate) {
						startDate = date;
					}

					if (date > lastDate) {
						lastDate = date;
					}
				});

				return {
					schemeCode,
					schemeName,
					startDate,
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
