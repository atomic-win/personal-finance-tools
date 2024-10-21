'use client';
import React from 'react';
import {
	Asset,
	Instrument,
	InstrumentType,
} from '@/features/investments/lib/types';
import { useSearchParams } from 'next/navigation';

export default function withInvestmentsFilter<
	T extends { assetIds: string[]; assets: Asset[]; instruments: Instrument[] }
>(Component: React.ComponentType<T>) {
	return function WithInvestmentsFilter(props: Omit<T, 'assetIds'>) {
		const { assets, instruments } = props;
		const searchParams = useSearchParams();

		const filteredInstrumentTypes = (searchParams.getAll('instrumentTypes') ||
			[]) as InstrumentType[];

		const filteredInstrumentIds = searchParams.getAll('instrumentIds') || [];
		const filteredAssetIds = searchParams.getAll('assetIds') || [];

		const applicableAssetIds = calculateApplicableAssetIds(
			filteredInstrumentTypes,
			filteredInstrumentIds,
			filteredAssetIds,
			assets,
			instruments
		);

		return (
			<Component
				{...(props as T)}
				assetIds={applicableAssetIds}
				assets={assets}
				instruments={instruments}
			/>
		);
	};
}

function calculateApplicableAssetIds(
	filteredInstrumentTypes: InstrumentType[],
	filteredInstrumentIds: string[],
	filteredAssetIds: string[],
	assets: Asset[],
	instruments: Instrument[]
): string[] {
	if (filteredAssetIds.length !== 0) {
		return filteredAssetIds;
	}

	const applicableInstrumentIds =
		filteredInstrumentIds.length !== 0
			? filteredInstrumentIds
			: instruments
					.filter(
						(instrument) =>
							filteredInstrumentTypes.length === 0 ||
							filteredInstrumentTypes.includes(instrument.type)
					)
					.map((instrument) => instrument.id);

	return assets
		.filter((asset) => applicableInstrumentIds.includes(asset.instrumentId))
		.map((asset) => asset.id);
}
