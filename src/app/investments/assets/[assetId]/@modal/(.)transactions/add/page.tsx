'use client';
import { Modal } from '@/components/Modal';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import { DialogContent, DialogHeader } from '@/components/ui/dialog';
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
		<Modal>
			<DialogContent>
				<DialogHeader>
					<SidebarTriggerWithBreadcrumb
						breadcrumbs={[
							{ title: 'Investments', href: '#' },
							{ title: 'Assets', href: '/investments/assets' },
							{
								title: asset.assetName,
								href: `/investments/assets/${asset.id}`,
							},
							{
								title: 'Add Transaction',
								href: `/investments/assets/${asset.id}/transactions/add`,
							},
						]}
					/>
				</DialogHeader>
				<div className='p-2'>
					<AddTransactionForm asset={asset} />
				</div>
			</DialogContent>
		</Modal>
	);
}
