import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';
import { useQueries } from '@tanstack/react-query';
import { Currency } from '@/lib/types';
import {
	Asset,
	Instrument,
	Portfolio,
	PortfolioType,
	Valuation,
} from '@/features/investments/lib/types';
import { DateTime } from 'luxon';

export default function usePortfolioQueries(
	currency: Currency | undefined,
	assetIds: string[] | undefined,
	assets: Asset[],
	instruments: Instrument[],
	idSelector: (asset: Asset, instrument: Instrument) => string,
	latest: boolean
) {
	const primalApiClient = usePrimalApiClient();
	assetIds = (assetIds || []).sort();
	assets = assets || [];
	instruments = instruments || [];

	const queryInputs = getQueryInputs(assetIds, assets, instruments, idSelector);

	console.log({
		currency,
		assetIds,
		assets,
		instruments,
		idSelector,
		latest,
		queryInputs,
	});

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
					id,
					date,
					type: PortfolioType.Overall,
					initialAmount: data.investedValue,
					initialAmountPercent: 100,
					currentAmount: data.currentValue,
					currentAmountPercent: 100,
					xirrPercent: data.xirrPercent,
					currency,
				} as Portfolio),
		})),
	});
}

function getQueryInputs(
	assetIds: string[],
	assets: Asset[],
	instruments: Instrument[],
	idSelector: (asset: Asset, instrument: Instrument) => string
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

	return Array.from(idToAssetIds.entries()).map(([id, assetIds]) => {
		return {
			id,
			assetIds,
			date: DateTime.now().toISODate(),
		};
	});
}
