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
import { AssetPortfolio, Transaction } from '@/features/investments/lib/types';
import { displayTransactionAmount } from '@/features/investments/lib/utils';
import { useDeleteTransactionMutation } from '@/features/investments/hooks/transactions';

export default function DeleteTransactionDialog({
	asset,
	transaction,
}: {
	asset: AssetPortfolio;
	transaction: Transaction;
}) {
	const { mutateAsync: deleteTransactionAsync } =
		useDeleteTransactionMutation();

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
						transaction.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<div>
					<InfoLine label='Date' value={transaction.date} />
					<InfoLine label='Transaction Name' value={transaction.name} />
					<InfoLine label='Transaction Type' value={transaction.type} />
					<InfoLine label='Asset Name' value={asset.assetName} />
					<InfoLine label='Units' value={transaction.units.toString()} />
					<InfoLine
						label='Transaction Amount'
						value={displayTransactionAmount(asset.currency, transaction.amount)}
					/>
				</div>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button variant='destructive' asChild>
						<AlertDialogAction
							onClick={async () => {
								await deleteTransactionAsync(transaction.id);
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
