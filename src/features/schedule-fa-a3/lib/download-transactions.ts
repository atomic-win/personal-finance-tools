import type { Transaction } from '@/features/schedule-fa-a3/lib/types';

export function downloadTransactions(transactions: Transaction[]) {
	const header = 'Date,Remarks,Symbol,Type,Units,Price';
	const rows = transactions.map(
		(t) => `${t.date},${t.remarks},${t.symbol},${t.type},${t.units},${t.price}`
	);
	const csv = [header, ...rows].join('\n');
	const blob = new Blob([csv], { type: 'text/csv' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = 'transactions.csv';
	a.click();
	URL.revokeObjectURL(url);
}
