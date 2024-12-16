'use client';
import Asset from '@/features/investments/components/Asset';
import { withAssetPortfolios } from '@/features/investments/components/hoc/withAssetPortfolios';
import withAssets from '@/features/investments/components/hoc/withAssets';
import withCurrency from '@/features/investments/components/hoc/withCurrency';
import withInstruments from '@/features/investments/components/hoc/withInstruments';
import withTransactions from '@/features/investments/components/hoc/withTransactions';
import { AssetPortfolio, Transaction } from '@/features/investments/lib/types';
import { Currency } from '@/lib/types';

export default function Page({ params }: { params: { assetId: string } }) {
	const assetId = params.assetId;

	const WithLoadedAssetWrapper = withAssets(
		withInstruments(
			withCurrency(withTransactions(withAssetPortfolios(AssetWrapper)))
		)
	);

	return <WithLoadedAssetWrapper assetIds={[assetId]} latest={true} />;
}

function AssetWrapper({
	portfolios,
	transactions,
	currency,
}: {
	portfolios: AssetPortfolio[];
	transactions: Transaction[];
	currency: Currency;
}) {
	const asset = portfolios[0];

	return (
		<div className='container mx-auto p-2'>
			<Asset asset={asset} transactions={transactions} currency={currency} />
		</div>
	);
}
