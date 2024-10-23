import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AssetPortfolio } from '@/features/investments/lib/types';
import withTransactions from '@/features/investments/components/hoc/withTransactions';
import TransactionsTable from '@/features/investments/components/TransactionsTable';
import { Separator } from '@/components/ui/separator';
import {
	displayCurrencyAmount,
	displayPercentage,
} from '@/features/investments/lib/utils';

export default function Asset({ asset }: { asset: AssetPortfolio }) {
	const WithLoadedLoadedTransactionsTable = withTransactions(TransactionsTable);

	return (
		<Card className='mx-auto my-2 p-2 rounded-lg shadow-md w-full'>
			<CardHeader>
				<CardTitle>{asset.assetName}</CardTitle>
			</CardHeader>
			<CardContent className='mt-0 space-y-4'>
				<div>
					<Separator />
					<div className='grid grid-cols-3 justify-between gap-2'>
						<InfoLine label='Asset Name' value={asset.assetName} />
						<InfoLine label='Instrument Name' value={asset.instrumentName} />
						<InfoLine label='Instrument Type' value={asset.instrumentType} />
						<InfoLine
							label='Invested Value'
							value={displayCurrencyAmount(asset.currency, asset.initialAmount)}
						/>
						<InfoLine
							label='Current Value'
							value={displayCurrencyAmount(asset.currency, asset.currentAmount)}
						/>
						<InfoLine
							label='XIRR'
							value={displayPercentage(asset.xirrPercent)}
						/>
					</div>
					<Separator />
				</div>
				<WithLoadedLoadedTransactionsTable
					assetId={asset.id}
					currency={asset.currency}
				/>
			</CardContent>
		</Card>
	);
}

function InfoLine({ label, value }: { label: string; value: string }) {
	return (
		<div className='flex'>
			<div className='text-lg font-semibold mr-2'>{label}:</div>
			<div className='text-lg'>{value}</div>
		</div>
	);
}
