import {
	InstrumentType,
	InstrumentTypePortfolio,
} from '@/features/investments/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import {
	displayCurrencyAmount,
	displayInstrumentType,
	displayPercentage,
} from '@/features/investments/lib/utils';
import { DataTable } from '@/components/ui/data-table';

const columns: ColumnDef<InstrumentTypePortfolio>[] = [
	{
		header: 'Instrument Type',
		accessorFn: (data) => displayInstrumentType(data.id as InstrumentType),
	},
	{
		header: 'Invested Value',
		accessorFn: (data) =>
			displayCurrencyAmount(data.currency, data.initialAmount),
	},
	{
		header: 'Invested Value (%)',
		accessorFn: (data) => displayPercentage(data.initialAmountPercent),
	},
	{
		header: 'Current Value',
		accessorFn: (data) =>
			displayCurrencyAmount(data.currency, data.currentAmount),
	},
	{
		header: 'Current Value (%)',
		accessorFn: (data) => displayPercentage(data.currentAmountPercent),
	},
	{
		header: 'XIRR (%)',
		accessorFn: (data) => displayPercentage(data.xirrPercent),
	},
];

export default function PortfolioPerInstrumentTypeSection({
	portfolios,
}: {
	portfolios: InstrumentTypePortfolio[];
}) {
	return (
		<div className='mx-auto'>
			<DataTable columns={columns} data={portfolios} />
		</div>
	);
}
