import { SwpCalculator } from '@/features/calculators/lib/types';
import {
	calculateSwpResult,
	displayCurrencyAmount,
	displayYearlyTimeDuration,
} from '@/features/calculators/lib/utils';

export default function SwpCalculatorResult({
	calculator,
}: {
	calculator: SwpCalculator;
}) {
	const result = calculateSwpResult(
		calculator.totalInvestmentAmount,
		calculator.monthlyWithdrawalAmount,
		calculator.annualInterestPercent,
		calculator.annualInflationPercent
	);

	return (
		<>
			{calculator.totalInvestmentAmount !== 0 && (
				<div className='mt-4 p-2 bg-green-100 rounded-md w-auto'>
					<table className='w-full'>
						<tbody>
							<tr>
								<td className='text-sm text-green-700 font-semibold'>
									Total Investment:
								</td>
								<td className='text-sm text-green-700 font-semibold text-right'>
									{displayCurrencyAmount(calculator.totalInvestmentAmount)}
								</td>
							</tr>
							<tr>
								<td className='text-sm text-green-700 font-semibold'>
									Estimated Total Withdrawal:
								</td>
								<td className='text-sm text-green-700 font-semibold text-right'>
									{displayCurrencyAmount(result.estimatedWithdrawalAmount)}
								</td>
							</tr>
							<tr>
								<td className='text-sm text-green-700 font-semibold'>
									Estimated SWP will last for:
								</td>
								<td className='text-sm text-green-700 font-semibold text-right'>
									{displayYearlyTimeDuration(result.estimatedNumberOfYears)}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			)}
		</>
	);
}
