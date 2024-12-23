'use client';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import { Card } from '@/components/ui/card';
import AddTransactionForm from '@/features/investments/components/forms/AddTransactionForm';
import { withAssetPortfolios } from '@/features/investments/components/hoc/withAssetPortfolios';
import withAssets from '@/features/investments/components/hoc/withAssets';
import withCurrency from '@/features/investments/components/hoc/withCurrency';
import withInstruments from '@/features/investments/components/hoc/withInstruments';
import withTransactions from '@/features/investments/components/hoc/withTransactions';
import { AssetPortfolio } from '@/features/investments/lib/types';

export default function Page({ params }: { params: { assetId: string } }) {
	const assetId = params.assetId;

	const WithAddTransactionFormWrapper = withAssets(
		withInstruments(
			withCurrency(
				withTransactions(withAssetPortfolios(AddTransactionFormWrapper))
			)
		)
	);

	return <WithAddTransactionFormWrapper assetIds={[assetId]} latest={true} />;
}

function AddTransactionFormWrapper({
	portfolios,
}: {
	portfolios: AssetPortfolio[];
}) {
	const asset = portfolios[0];

	return (
		<>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{ title: 'Investments', href: '#', disabled: true },
					{ title: 'Assets', href: '/investments/assets' },
					{ title: asset.assetName, href: `/investments/assets/${asset.id}` },
					{
						title: 'Add Transaction',
						href: `/investments/assets/${asset.id}/transactions/add`,
					},
				]}
			/>
			<div className='container mx-auto p-2 h-full'>
				<Card className='p-8 max-w-screen-sm mx-auto'>
					<AddTransactionForm asset={asset} />
				</Card>
			</div>
		</>
	);
}
