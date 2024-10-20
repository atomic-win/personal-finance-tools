'use client';
import React from 'react';
import { Asset, Instrument } from '@/features/investments/lib/types';

export default function withInvestmentsFilter<
	T extends { assetIds: string[]; assets: Asset[]; instruments: Instrument[] }
>(Component: React.ComponentType<T>) {
	return function WithInvestmentsFilter(props: Omit<T, 'assetIds'>) {
		const { assets, instruments } = props;

		return (
			<Component
				{...(props as T)}
				assetIds={assets.map((asset) => asset.id)}
				assets={assets}
				instruments={instruments}
			/>
		);
	};
}
