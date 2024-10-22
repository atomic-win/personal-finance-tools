'use client';
import { withAssetPortfolios } from '@/features/investments/components/hoc/withAssetPortfolios';
import withAssets from '@/features/investments/components/hoc/withAssets';
import withCurrency from '@/features/investments/components/hoc/withCurrency';
import withInstruments from '@/features/investments/components/hoc/withInstruments';
import withTransactions from '@/features/investments/components/hoc/withTransactions';
import TransactionsTable from '@/features/investments/components/TransactionsTable';

export default function Page() {
	const WithLoadedTransactionsTable = withAssets(
		withInstruments(
			withCurrency(
				withAssetPortfolios(withCurrency(withTransactions(TransactionsTable)))
			)
		)
	);

	return (
		<div className='container mx-auto p-2'>
			<h1 className='text-2xl font-bold mb-4'>Transactions</h1>
			<WithLoadedTransactionsTable assetIds={[]} latest={true} />
		</div>
	);
}
