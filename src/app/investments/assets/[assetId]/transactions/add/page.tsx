'use client';
import AddTransactionForm from '@/features/investments/components/forms/AddTransactionForm';

export default function Page({ params }: { params: { assetId: string } }) {
	return (
		<div className='container mx-auto p-2'>
			<h1 className='text-2xl font-bold mb-4'>Add Transaction</h1>
			<AddTransactionForm assetId={params.assetId} />
		</div>
	);
}
