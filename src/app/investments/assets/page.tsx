'use client';
import AssetsTable from '@/features/investments/components/AssetsTable';
import { withAssetPortfolios } from '@/features/investments/components/hoc/withAssetPortfolios';
import withAssets from '@/features/investments/components/hoc/withAssets';
import withCurrency from '@/features/investments/components/hoc/withCurrency';
import withInstruments from '@/features/investments/components/hoc/withInstruments';

export default function Page() {
	const WithLoadedAssetsTable = withAssets(
		withInstruments(withCurrency(withAssetPortfolios(AssetsTable)))
	);

	return (
		<div className='container mx-auto p-2'>
			<h1 className='text-2xl font-bold mb-4'>Assets</h1>
			<WithLoadedAssetsTable assetIds={[]} latest={true} transactions={[]} />
		</div>
	);
}
