import {
	Instrument,
	Return,
	ReturnRequest,
} from '@/features/returns/lib/types';
import { getLuxonDuration } from '@/features/returns/lib/utils';
import { useQueries, useQuery } from '@tanstack/react-query';
import { DateTime } from 'luxon';

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
					.map(
						(r) =>
							({
								...r,
								symbol: instrument.symbol,
							} as Return)
					),
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

			console.debug(
				`Rolling returns for ${instrument.symbol} (${instrument.name}): ` +
					`availableDays=${availableDays}, totalDays=${totalDays}, shouldUseData=${shouldUseData}`
			);

			return shouldUseData ? a : [];
		},
	});
}

function createReturnsQuery(request: ReturnRequest, instrument: Instrument) {
	const {
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
			'instruments',
			instrument.type,
			instrument.symbol,
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

				worker.postMessage({ instrument, request });
			});
		},
		staleTime: 1000 * 60 * 60, // 1 hour
		refetchInterval: 1000 * 60 * 60, // 1 hour
		refetchIntervalInBackground: true,
	};
}
