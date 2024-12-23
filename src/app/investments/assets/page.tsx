'use client';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
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
		<>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{ title: 'Investments', href: '#' },
					{ title: 'Assets', href: '/investments/assets' },
				]}
			/>
			<div className='container mx-auto p-2'>
				<WithLoadedAssetsTable assetIds={[]} latest={true} transactions={[]} />
			</div>
		</>
	);
}
