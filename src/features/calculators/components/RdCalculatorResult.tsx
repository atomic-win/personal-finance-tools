import { RdCalculator } from '@/features/calculators/lib/types';
import {
	calculateRdResult,
	displayCurrencyAmount,
} from '@/features/calculators/lib/utils';

export default function RdCalculatorResult({
	calculator,
}: {
	calculator: RdCalculator;
}) {
	const { maturityAmount, interestEarned, totalInvestment } = calculateRdResult(
		calculator.monthlyDepositAmount,
		calculator.annualInterestRate,
		calculator.numberOfYears * 12
	);

	return (
		<div className='mt-4 p-2 bg-green-100 rounded-md w-auto'>
			<table className='w-full'>
				<tbody>
					<tr>
						<td className='text-sm text-green-700 font-semibold'>
							Total Investment:
						</td>
						<td className='text-sm text-green-700 font-semibold text-right'>
							{displayCurrencyAmount(totalInvestment, 2, 'standard')}
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
						<td className='text-green-700 font-semibold'>Maturity Amount:</td>
						<td className='text-green-700 font-semibold text-right'>
							{displayCurrencyAmount(maturityAmount, 2, 'standard')}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}
