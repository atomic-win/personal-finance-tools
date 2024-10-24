'use client';
import { Card } from '@/components/ui/card';
import AddTransactionForm from '@/features/investments/components/forms/AddTransactionForm';

export default function Page({ params }: { params: { assetId: string } }) {
	return (
		<div className='container mx-auto p-2'>
			<h1 className='text-2xl font-bold mb-4'>Add Transaction</h1>
			<div className='w-1/3 mx-auto'>
				<Card className='p-4 pb-0'>
					<AddTransactionForm assetId={params.assetId} />
				</Card>
			</div>
		</div>
	);
}
