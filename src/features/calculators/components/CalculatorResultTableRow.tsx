import CurrencyAmount from '@/components/currency-amount';
import { displayYearlyTimeDuration } from '@/features/calculators/lib/utils';

export default function CalculatorResultTableRow({
	label,
	value,
	type,
}: {
	label: string;
	value: number;
	type: 'amount' | 'year';
}) {
	return (
		<tr className='border-y border-green-700 w-full'>
			<td className='text-sm text-green-700 font-semibold w-1/2'>
				{label}:
			</td>
			<td className='text-sm text-green-700 font-semibold text-right w-1/2'>
				{type === 'amount' && <CurrencyAmount amount={value} />}
				{type === 'year' && displayYearlyTimeDuration(value)}
			</td>
		</tr>
	);
}
