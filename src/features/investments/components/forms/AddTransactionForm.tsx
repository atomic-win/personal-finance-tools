'use client';
import { CardContent } from '@/components/ui/card';
import { AssetPortfolio } from '@/features/investments/lib/types';
import withAssets from '@/features/investments/components/hoc/withAssets';
import { withAssetPortfolios } from '@/features/investments/components/hoc/withAssetPortfolios';
import withInstruments from '@/features/investments/components/hoc/withInstruments';
import withCurrency from '@/features/investments/components/hoc/withCurrency';

export default function AddTransactionForm({ assetId }: { assetId: string }) {
	const WithLoadedForm = withAssets(
		withInstruments(withCurrency(withAssetPortfolios(Form)))
	);

	return <WithLoadedForm assetIds={[assetId]} latest={true} />;
}

function Form({ portfolios }: { portfolios: AssetPortfolio[] }) {
	const asset = portfolios[0];

	return <CardContent></CardContent>;
}
