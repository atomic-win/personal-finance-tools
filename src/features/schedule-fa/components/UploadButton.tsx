import { UploadIcon } from 'lucide-react';
import { DateTime } from 'luxon';
import { useRef, useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useSetTransactionsMutation } from '@/features/schedule-fa/hooks/transactions';
import type { Transaction } from '@/features/schedule-fa/lib/types';

export default function UploadButton() {
	const { mutate: setTransactions } = useSetTransactionsMutation();
	const [error, setError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setError(null);

		try {
			const text = await file.text();
			const transactions = parseFile(text);
			setTransactions(transactions);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to parse file');
		}

		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	return (
		<div className='flex items-center gap-2'>
			<Button
				variant='outline'
				size='sm'
				onClick={() => fileInputRef.current?.click()}
			>
				<UploadIcon className='size-4' />
				Upload File
			</Button>
			<input
				ref={fileInputRef}
				type='file'
				accept='.csv,.tsv,.txt'
				onChange={handleFileChange}
				className='hidden'
			/>
			{error && <span className='text-sm text-destructive'>{error}</span>}
		</div>
	);
}

// --- File parsing ---

const csvRowSchema = z.object({
	Date: z.string(),
	Remarks: z.string().optional(),
	Symbol: z.string().min(1),
	Type: z.enum(['Buy', 'Sell']),
	Units: z.coerce.number().positive(),
	Price: z.coerce.number().nonnegative(),
});

const dateFormats = [
	'yyyy-MM-dd',
	'yyyy/MM/dd',
	'MM-dd-yyyy',
	'MM/dd/yyyy',
	'M/d/yyyy',
	'dd-MM-yyyy',
	'dd/MM/yyyy',
	'd/M/yyyy',
	'dd.MM.yyyy',
];

function detectDelimiter(headerLine: string): string {
	const tabCount = (headerLine.match(/\t/g) || []).length;
	const commaCount = (headerLine.match(/,/g) || []).length;
	return tabCount > commaCount ? '\t' : ',';
}

function normalizeDate(raw: string, rowNum: number): string {
	for (const fmt of dateFormats) {
		const dt = DateTime.fromFormat(raw.trim(), fmt);
		if (dt.isValid) {
			return dt.toISODate() ?? raw;
		}
	}
	const iso = DateTime.fromISO(raw.trim());
	if (iso.isValid) {
		return iso.toISODate() ?? raw;
	}
	throw new Error(`Row ${rowNum}: Unable to parse date "${raw}"`);
}

function parseFile(csvText: string): Transaction[] {
	const lines = csvText.trim().split('\n');
	if (lines.length < 2) {
		throw new Error('File must have a header row and at least one data row');
	}

	const delimiter = detectDelimiter(lines[0]);
	const header = lines[0].split(delimiter).map((h) => h.trim());
	const requiredColumns = ['Date', 'Symbol', 'Type', 'Units', 'Price'];
	for (const col of requiredColumns) {
		if (!header.includes(col)) {
			throw new Error(`Missing required column: ${col}`);
		}
	}

	const transactions: Transaction[] = [];

	for (let i = 1; i < lines.length; i++) {
		const line = lines[i].trim();
		if (!line) continue;

		const values = line.split(delimiter).map((v) => v.trim());
		const row: Record<string, string> = {};
		for (let j = 0; j < header.length; j++) {
			row[header[j]] = values[j] ?? '';
		}

		const parsed = csvRowSchema.safeParse(row);
		if (!parsed.success) {
			throw new Error(
				`Row ${i + 1}: ${parsed.error.issues.map((e) => e.message).join(', ')}`
			);
		}

		transactions.push({
			id: '',
			date: normalizeDate(parsed.data.Date, i + 1),
			remarks: parsed.data.Remarks ?? '',
			symbol: parsed.data.Symbol.toUpperCase(),
			type: parsed.data.Type,
			units: parsed.data.Units,
			price: parsed.data.Price,
		});
	}

	return transactions;
}
