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
	const { maturityAmount, totalDepositAmount, interestEarned } =
		calculateRdResult(
			calculator.monthlyDepositAmount,
			calculator.annualInterestRate,
			calculator.numberOfYears
		);

	return (
		<div className='mt-4 p-2 bg-green-100 rounded-md w-auto'>
			<table className='w-full'>
				<tbody>
					<tr>
						<td className='text-sm text-green-700 font-semibold'>
							Total Deposit Amount:
						</td>
						<td className='text-sm text-green-700 font-semibold text-right'>
							{displayCurrencyAmount(totalDepositAmount, 2, 'standard')}
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
