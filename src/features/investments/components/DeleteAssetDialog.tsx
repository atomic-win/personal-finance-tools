import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AssetPortfolio } from '@/features/investments/lib/types';
import {
	displayInstrumentType,
	displayPercentage,
} from '@/features/investments/lib/utils';
import { useDeleteAssetMutation } from '@/features/investments/hooks/assets';
import { Currency } from '@/lib/types';
import { displayCurrencyAmount } from '@/lib/utils';

export default function DeleteAssetDialog({
	asset,
	currency,
}: {
	asset: AssetPortfolio;
	currency: Currency;
}) {
	const { mutateAsync: deleteAssetAsync } = useDeleteAssetMutation();

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant='destructive'>Delete</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete the
						asset.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<div>
					<InfoLine label='Asset Name' value={asset.assetName} />
					<InfoLine label='Instrument Name' value={asset.instrumentName} />
					<InfoLine
						label='Instrument Type'
						value={displayInstrumentType(asset.instrumentType)}
					/>
					<InfoLine
						label='Invested Value'
						value={displayCurrencyAmount(currency, asset.investedValue)}
					/>
					<InfoLine
						label='Current Value'
						value={displayCurrencyAmount(currency, asset.currentValue)}
					/>
					<InfoLine label='XIRR' value={displayPercentage(asset.xirrPercent)} />
				</div>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button variant='destructive' asChild>
						<AlertDialogAction
							onClick={async () => {
								await deleteAssetAsync(asset.id);
							}}>
							Delete
						</AlertDialogAction>
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

function InfoLine({ label, value }: { label: string; value: string }) {
	return (
		<div className='flex'>
			<div className='text-sm font-semibold mr-2'>{label}:</div>
			<div className='text-sm'>{value}</div>
		</div>
	);
}
