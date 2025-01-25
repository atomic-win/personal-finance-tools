import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';
import { useQueries } from '@tanstack/react-query';
import {
	Asset,
	Instrument,
	Transaction,
	Valuation,
} from '@/features/investments/lib/types';
import { DateTime } from 'luxon';

export default function useValuationQueries(
	currency: string | undefined,
	assetIds: string[] | undefined,
	assets: Asset[],
	instruments: Instrument[],
	transactions: Transaction[],
	idSelector: (asset: Asset, instrument: Instrument) => string,
	latest: boolean
) {
	const primalApiClient = usePrimalApiClient();
	assetIds = (assetIds || []).sort();
	assets = assets || [];
	instruments = instruments || [];

	const queryInputs = getQueryInputs(
		assetIds,
		assets,
		instruments,
		transactions,
		idSelector,
		latest
	);

	return useQueries({
		queries: queryInputs.map(({ id, assetIds, date }) => ({
			queryKey: [
				'investments',
				'assets',
				'valuation',
				{
					date,
					assetIds,
					currency,
				},
			],
			queryFn: async () => {
				const response = await primalApiClient.post(
					'/investments/assets/valuation',
					{
						date,
						assetIds,
						currency,
					}
				);
				return response.data as Valuation;
			},
			enabled:
				!!currency &&
				assetIds.length > 0 &&
				assets.length > 0 &&
				instruments.length > 0,
			select: (data: Valuation) =>
				({
					...data,
					id,
					date,
				} as Valuation),
		})),
	});
}

function getQueryInputs(
	assetIds: string[],
	assets: Asset[],
	instruments: Instrument[],
	transactions: Transaction[],
	idSelector: (asset: Asset, instrument: Instrument) => string,
	latest: boolean
): { id: string; assetIds: string[]; date: string }[] {
	const idToAssetIds = new Map<string, string[]>();

	for (const assetId of assetIds) {
		const asset = assets.find((x) => x.id === assetId)!;
		const instrument = instruments.find((x) => x.id === asset.instrumentId)!;

		const id = idSelector(asset, instrument);

		if (!idToAssetIds.has(id)) {
			idToAssetIds.set(id, []);
		}

		idToAssetIds.get(id)!.push(assetId);
	}

	const dates = getQueryDates(assetIds, transactions, latest);

	return Array.from(idToAssetIds.entries()).flatMap(([id, assetIds]) =>
		dates.map((date) => ({
			id,
			assetIds,
			date,
		}))
	);
}

function getQueryDates(
	assetIds: string[],
	transactions: Transaction[],
	latest: boolean
): string[] {
	const dates = [DateTime.now().toISODate()];

	if (!latest) {
		const earliestDate = DateTime.fromISO(
			transactions
				.filter((x) => assetIds.includes(x.assetId))
				.reduce((acc, x) => (x.date < acc ? x.date : acc), dates[0])
		);

		let date = DateTime.now().minus({ months: 1 }).endOf('month');
		while (date >= earliestDate) {
			dates.push(date.toISODate());
			date = date.minus({ months: 1 }).endOf('month');
		}
	}

	return dates;
}
