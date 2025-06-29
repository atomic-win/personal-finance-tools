import {
	Instrument,
	Return,
	ReturnRequest,
} from '@/features/indian-mutual-funds-analysis/lib/types';
import { getLuxonDuration } from '@/features/indian-mutual-funds-analysis/lib/utils';
import { useQueries, useQuery } from '@tanstack/react-query';
import { DateTime } from 'luxon';
import {
	getMutualFundsList,
	getMutualFundRates,
} from '@/features/indian-mutual-funds-analysis/services/mfApiService';

export function useMutualFundListQuery() {
	return useQuery({
		queryKey: ['mutualfunds', 'list'],
		queryFn: async () => await getMutualFundsList(),
		staleTime: 1000 * 60 * 60 * 24, // 24 hours
		refetchInterval: 1000 * 60 * 60 * 24, // 24 hours
		refetchIntervalInBackground: true,
	});
}

export function useMutualFundQueries(schemeCodes: number[]) {
	return useQueries({
		queries: schemeCodes.map((schemeCode) => ({
			queryKey: ['mutualfunds', schemeCode],
			queryFn: async () => await getMutualFundRates(schemeCode),
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
