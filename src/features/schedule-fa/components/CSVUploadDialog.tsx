import { UploadIcon } from 'lucide-react';
import { DateTime } from 'luxon';
import { useRef, useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { useSetTransactionsMutation, useTransactionsQuery } from '@/features/schedule-fa/hooks/transactions';
import type { Transaction } from '@/features/schedule-fa/lib/types';

// --- CSV parsing ---

type TransactionInput = Omit<Transaction, 'id'>;

const csvRowSchema = z.object({
	Date: z.string(),
	Remarks: z.string().optional(),
	Symbol: z.string().min(1),
	Type: z.enum(['Buy', 'Sell']),
	Units: z.coerce.number().positive(),
	Price: z.coerce.number().nonnegative(),
});

function detectDelimiter(headerLine: string): string {
	const tabCount = (headerLine.match(/\t/g) || []).length;
	const commaCount = (headerLine.match(/,/g) || []).length;
	return tabCount > commaCount ? '\t' : ',';
}

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

function parseCSV(csvText: string): TransactionInput[] {
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

	const transactions: TransactionInput[] = [];

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

export default function CSVUploadDialog() {
	const { data: existing = [] } = useTransactionsQuery();
	const { mutate: setTransactions } = useSetTransactionsMutation();
	const [open, setOpen] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [preview, setPreview] = useState<TransactionInput[] | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setError(null);
		setPreview(null);

		try {
			const text = await file.text();
			const transactions = parseCSV(text);
			setPreview(transactions);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to parse CSV');
		}
	};

	const handleImport = () => {
		if (preview) {
			setTransactions([...existing, ...preview]);
			setOpen(false);
			setPreview(null);
			setError(null);
		}
	};

	const handleOpenChange = (nextOpen: boolean) => {
		setOpen(nextOpen);
		if (!nextOpen) {
			setPreview(null);
			setError(null);
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger render={<Button variant='outline' size='sm' />}>
				<UploadIcon className='size-4' />
				Upload File
			</DialogTrigger>
			<DialogContent className='sm:max-w-lg'>
				<DialogHeader>
					<DialogTitle>Upload Transactions CSV / TSV</DialogTitle>
					<DialogDescription>
						CSV or TSV format: Date, Remarks, Symbol, Type (Buy/Sell), Units, Price
					</DialogDescription>
				</DialogHeader>
				<div className='space-y-4'>
					<input
						ref={fileInputRef}
						type='file'
						accept='.csv,.tsv,.txt'
						onChange={handleFileChange}
						className='block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/80 cursor-pointer'
					/>
					{error && <p className='text-sm text-destructive'>{error}</p>}
					{preview && (
						<div className='space-y-2'>
							<p className='text-sm text-muted-foreground'>
								Found <strong>{preview.length}</strong> transactions:
							</p>
							<div className='max-h-48 overflow-y-auto text-xs border rounded-md'>
								<table className='w-full'>
									<thead>
										<tr className='border-b bg-muted/50'>
											<th className='p-2 text-left'>Type</th>
											<th className='p-2 text-left'>Symbol</th>
											<th className='p-2 text-left'>Date</th>
											<th className='p-2 text-left'>Units</th>
											<th className='p-2 text-left'>Price</th>
										</tr>
									</thead>
									<tbody>
										{preview.map((h) => (
											<tr key={h.id} className='border-b last:border-0'>
												<td className='p-2'>{h.type}</td>
												<td className='p-2'>{h.symbol}</td>
												<td className='p-2'>{h.date}</td>
												<td className='p-2'>{h.units}</td>
												<td className='p-2'>${h.price}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}
				</div>
				<DialogFooter>
					<Button onClick={handleImport} disabled={!preview}>
						Import {preview?.length ?? 0} Transactions
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
