'use client';
import { Modal } from '@/components/Modal';
import AddTransactionForm from '@/features/investments/components/forms/AddTransactionForm';

export default function Page({ params }: { params: { assetId: string } }) {
	return (
		<Modal>
			<div className='text-xl font-bold mb-4'>Add Transaction</div>
			<AddTransactionForm assetId={params.assetId} />
		</Modal>
	);
}
