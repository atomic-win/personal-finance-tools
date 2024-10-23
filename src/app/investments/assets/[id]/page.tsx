'use client';
import Asset from '@/features/investments/components/Asset';
import { withAssetPortfolios } from '@/features/investments/components/hoc/withAssetPortfolios';
import withAssets from '@/features/investments/components/hoc/withAssets';
import withCurrency from '@/features/investments/components/hoc/withCurrency';
import withInstruments from '@/features/investments/components/hoc/withInstruments';
import { AssetPortfolio } from '@/features/investments/lib/types';

export default function Page({ params }: { params: { id: string } }) {
	const id = params.id;

	const WithLoadedAssetWrapper = withAssets(
		withInstruments(withCurrency(withAssetPortfolios(AssetWrapper)))
	);

	return <WithLoadedAssetWrapper assetIds={[id]} latest={true} />;
}

function AssetWrapper({ portfolios }: { portfolios: AssetPortfolio[] }) {
	const asset = portfolios[0];

	return (
		<div className='container mx-auto p-2'>
			<Asset asset={asset} />
		</div>
	);
}
