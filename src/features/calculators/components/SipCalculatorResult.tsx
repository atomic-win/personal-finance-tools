import { SipCalculator } from '@/features/calculators/lib/types';
import {
	calculateSipResult,
	displayCurrencyAmount,
} from '@/features/calculators/lib/utils';

export default function SipCalculatorResult({
	calculator,
}: {
	calculator: SipCalculator;
}) {
	const result = calculateSipResult(
		calculator.lumpsumAmount,
		calculator.monthlyInvestmentAmount,
		calculator.annualInterestPercent,
		calculator.annualStepUpPercent,
		calculator.numberOfYears
	);

	return (
		<>
			{result.totalInvestedAmount !== 0 && (
				<div className='mt-4 p-2 bg-green-100 rounded-md w-auto'>
					<table className='w-full'>
						<tbody>
							<tr>
								<td className='text-sm text-green-700 font-semibold'>
									Total Invested Amount:
								</td>
								<td className='text-sm text-green-700 font-semibold text-right'>
									{displayCurrencyAmount(result.totalInvestedAmount)}
								</td>
							</tr>
							<tr>
								<td className='text-sm text-green-700 font-semibold'>
									Estimated Returns:
								</td>
								<td className='text-sm text-green-700 font-semibold text-right'>
									{displayCurrencyAmount(result.estimatedReturns)}
								</td>
							</tr>
							<tr>
								<td className='text-sm text-green-700 font-semibold'>
									Estimated Total Value:
								</td>
								<td className='text-sm text-green-700 font-semibold text-right'>
									{displayCurrencyAmount(result.estimatedTotalValue)}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			)}
		</>
	);
}
