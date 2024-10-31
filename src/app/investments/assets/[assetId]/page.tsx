'use client';
import Asset from '@/features/investments/components/Asset';
import { withAssetPortfolios } from '@/features/investments/components/hoc/withAssetPortfolios';
import withAssets from '@/features/investments/components/hoc/withAssets';
import withCurrency from '@/features/investments/components/hoc/withCurrency';
import withInstruments from '@/features/investments/components/hoc/withInstruments';
import { AssetPortfolio } from '@/features/investments/lib/types';
import { Currency } from '@/lib/types';

export default function Page({ params }: { params: { assetId: string } }) {
	const assetId = params.assetId;

	const WithLoadedAssetWrapper = withAssets(
		withInstruments(withCurrency(withAssetPortfolios(AssetWrapper)))
	);

	return <WithLoadedAssetWrapper assetIds={[assetId]} latest={true} />;
}

function AssetWrapper({
	portfolios,
	currency,
}: {
	portfolios: AssetPortfolio[];
	currency: Currency;
}) {
	const asset = portfolios[0];

	return (
		<div className='container mx-auto p-2'>
			<Asset asset={asset} currency={currency} />
		</div>
	);
}
