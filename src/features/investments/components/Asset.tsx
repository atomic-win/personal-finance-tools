import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AssetPortfolio, Transaction } from '@/features/investments/lib/types';
import TransactionsTable from '@/features/investments/components/TransactionsTable';
import { Separator } from '@/components/ui/separator';
import {
	displayInstrumentType,
	displayPercentage,
} from '@/features/investments/lib/utils';
import React from 'react';
import CurrencyAmount from '@/components/CurrencyAmount';

export default function Asset({
	asset,
	transactions,
	currency,
}: {
	asset: AssetPortfolio;
	transactions: Transaction[];
	currency: string;
}) {
	return (
		<Card className='mx-auto my-2 rounded-lg shadow-md w-full'>
			<CardHeader>
				<div className='grid grid-cols-3 justify-between gap-2'>
					<InfoLine label='Asset Name' value={asset.assetName} />
					<InfoLine label='Instrument Name' value={asset.instrumentName} />
					<InfoLine
						label='Instrument Type'
						value={displayInstrumentType(asset.instrumentType)}
					/>
					<InfoLine
						label='Invested Value'
						value={<CurrencyAmount amount={asset.investedValue} />}
					/>
					<InfoLine
						label='Current Value'
						value={<CurrencyAmount amount={asset.currentValue} />}
					/>
					<InfoLine label='XIRR' value={displayPercentage(asset.xirrPercent)} />
				</div>
				<Separator />
			</CardHeader>
			<CardContent className='mt-0 space-y-4'>
				<TransactionsTable
					asset={asset}
					transactions={transactions}
					currency={currency}
				/>
			</CardContent>
		</Card>
	);
}

function InfoLine({ label, value }: { label: string; value: React.ReactNode }) {
	return (
		<div className='flex'>
			<div className='text-lg font-semibold mr-2'>{label}:</div>
			<div className='text-lg'>{value}</div>
		</div>
	);
}
