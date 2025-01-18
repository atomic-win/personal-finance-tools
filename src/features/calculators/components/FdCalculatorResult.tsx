import { FdCalculator } from '@/features/calculators/lib/types';
import {
	calculateFdResult,
	displayCurrencyAmount,
} from '@/features/calculators/lib/utils';

export default function FdCalculatorResult({
	calculator,
}: {
	calculator: FdCalculator;
}) {
	const { maturityAmount, interestEarned } = calculateFdResult(
		calculator.principalAmount,
		calculator.annualInterestRate,
		calculator.numberOfYears,
		calculator.compoundingFrequency
	);

	return (
		<div className='mt-4 p-2 bg-green-100 rounded-md w-auto'>
			<table className='w-full'>
				<tbody>
					<tr>
						<td className='text-sm text-green-700 font-semibold'>
							Principal Amount:
						</td>
						<td className='text-sm text-green-700 font-semibold text-right'>
							{displayCurrencyAmount(calculator.principalAmount, 2, 'standard')}
						</td>
					</tr>
					<tr>
						<td className='text-sm text-green-700 font-semibold'>
							Interest Earned:
						</td>
						<td className='text-sm text-green-700 font-semibold text-right'>
							{displayCurrencyAmount(interestEarned, 2, 'standard')}
						</td>
					</tr>
					<tr>
						<td className='text-sm text-green-700 font-semibold'>
							Maturity Amount:
						</td>
						<td className='text-sm text-green-700 font-semibold text-right'>
							{displayCurrencyAmount(maturityAmount, 2, 'standard')}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}
