import { useQueries, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import _ from 'lodash';
import { DateTime } from 'luxon';
import { getSupportedIndex } from '@/features/investment-analysis/lib/indexes';
import type {
	Instrument,
	MutualFundListItem,
	Return,
	ReturnRequest,
} from '@/features/investment-analysis/lib/types';
import {
	buildDailySeries,
	getLuxonDuration,
} from '@/features/investment-analysis/lib/utils';
import { fetchFxRates } from '@/features/investment-analysis/server/fetch-fx-rates';
import { fetchIndexHistory } from '@/features/investment-analysis/server/fetch-index-history';

const MUTUAL_FUND_CURRENCY = 'INR';

const mfApiClient = axios.create({
	baseURL: 'https://api.mfapi.in',
	validateStatus: () => true,
});

export function useMutualFundListQuery() {
	return useQuery({
		queryKey: ['mutualfunds', 'list'],
		queryFn: async () => {
			return (await mfApiClient.get('mf')).data as MutualFundListItem[];
		},
		select: (data) => _.uniqBy(data, (mf) => mf.schemeCode),
	});
}

export function useMutualFundQueries(schemeCodes: number[]) {
	return useQueries({
		queries: schemeCodes.map((schemeCode) => ({
			queryKey: ['mutualfunds', schemeCode],
			queryFn: async (): Promise<Instrument> => {
				const apiResponse = (await mfApiClient.get(`mf/${schemeCode}`))
					.data as {
					meta: { scheme_code: number; scheme_name: string };
					data: { date: string; nav: number }[];
				};

				const prices: Record<string, number> = {};

				apiResponse.data.forEach((x) => {
					const date = DateTime.fromFormat(x.date, 'dd-MM-yyyy').toISODate();

					if (date) {
						prices[date] = Number(x.nav);
					}
				});

				return {
					id: getMutualFundInstrumentId(schemeCode),
					name: apiResponse.meta.scheme_name,
					type: 'mutual-fund',
					currency: MUTUAL_FUND_CURRENCY,
					...buildDailySeries(prices),
				};
			},
		})),
	});
}

export function useIndexQueries(symbols: string[]) {
	return useQueries({
		queries: symbols.map((symbol) => ({
			queryKey: ['indexes', symbol],
			queryFn: async (): Promise<Instrument> => {
				const supportedIndex = getSupportedIndex(symbol);

				if (!supportedIndex) {
					throw new Error(`Unsupported index symbol: ${symbol}`);
				}

				const response = await fetchIndexHistory({ data: { symbol } });

				return {
					id: getIndexInstrumentId(symbol),
					name: supportedIndex.name,
					type: 'index',
					currency: response.currency || supportedIndex.currency,
					...buildDailySeries(response.prices),
				};
			},
		})),
	});
}

export function useFxRatesQueries(
	currencies: string[],
	targetCurrency: string
) {
	return useQueries({
		queries: currencies.map((currency) => ({
			queryKey: ['fx-rates', currency, targetCurrency],
			queryFn: async (): Promise<Record<string, number>> => {
				if (currency === targetCurrency) {
					return {};
				}

				const response = await fetchFxRates({
					data: { from: currency, to: targetCurrency },
				});

				return buildDailySeries(response.rates).prices;
			},
		})),
	});
}

export function useReturnQueries(
	request: ReturnRequest,
	instruments: Instrument[]
) {
	const { rollingWindow } = request;
	const earliestDate = DateTime.min(
		...instruments.map((instrument) => DateTime.fromISO(instrument.lastDate)),
		DateTime.local()
	)
		.minus(getLuxonDuration(rollingWindow))
		.plus({ days: 1 });

	return useQueries({
		queries: instruments.map((instrument) => ({
			...createReturnsQuery(request, instrument),
			select: (returns: Return[]) =>
				returns
					.filter((r) => DateTime.fromISO(r.date) >= earliestDate)
					.map((r) => ({
						...r,
						instrumentId: instrument.id,
					})),
		})),
	});
}

export function useRollingReturnsQuery(
	request: ReturnRequest,
	instrument: Instrument
) {
	return useQuery({
		...createReturnsQuery(request, instrument),
		select: (returns: Return[]) => {
			const startDate = DateTime.fromISO(instrument.lastDate)
				.minus(getLuxonDuration(request.rollingWindow))
				.plus({ days: 1 });

			const a = returns
				.filter((r) => DateTime.fromISO(r.date) >= startDate)
				.map((r) => r.return);

			const totalDays = DateTime.fromISO(instrument.lastDate).diff(
				startDate,
				'days'
			).days;

			const availableDays = a.length;
			const shouldUseData = availableDays / Math.max(1, totalDays) >= 0.9;

			return shouldUseData ? a : [];
		},
	});
}

export function getMutualFundInstrumentId(schemeCode: number) {
	return `mf:${schemeCode}`;
}

export function getIndexInstrumentId(symbol: string) {
	return `index:${symbol}`;
}

function createReturnsQuery(request: ReturnRequest, instrument: Instrument) {
	const {
		investmentDuration,
		returnType,
		frequency,
		stepUpFrequency,
		stepUpRatio,
	} = request;

	if (!returnType) {
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
			'instruments',
			instrument.id,
			instrument.currency,
			instrument.lastDate,
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
			const WorkerModule = await import('../workers/returns.worker.ts?worker');
			const worker = new WorkerModule.default();

			return new Promise((resolve, reject) => {
				worker.onmessage = (event: MessageEvent<Return[]>) => {
					resolve(event.data);
					worker.terminate();
				};

				worker.onerror = (error: ErrorEvent) => {
					reject(error.message);
					worker.terminate();
				};

				worker.postMessage({ instrument, request });
			});
		},
	};
}
