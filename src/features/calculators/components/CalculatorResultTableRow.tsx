import { displayYearlyTimeDuration } from '@/features/calculators/lib/utils';
import useCurrencyQuery from '@/hooks/useCurrencyQuery';
import { displayCurrencyAmount } from '@/lib/utils';

export default function CalculatorResultTableRow({
	label,
	value,
	type,
}: {
	label: string;
	value: number;
	type: 'amount' | 'year';
}) {
	const { data: currency, isLoading } = useCurrencyQuery();

	if (isLoading || !currency) {
		return null;
	}

	return (
		<tr className='border-y border-green-700 w-full'>
			<td className='text-sm text-green-700 font-semibold w-1/2'>{label}:</td>
			<td className='text-sm text-green-700 font-semibold text-right w-1/2'>
				{type === 'amount' && displayCurrencyAmount(currency, value)}
				{type === 'year' && displayYearlyTimeDuration(value)}
			</td>
		</tr>
	);
}
