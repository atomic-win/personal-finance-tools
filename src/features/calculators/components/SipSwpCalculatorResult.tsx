import { SipSwpCalculator } from '@/features/calculators/lib/types';
import {
	calculateSipResult,
	calculateSwpResult,
	displayCurrencyAmount,
	displayYearlyTimeDuration,
} from '@/features/calculators/lib/utils';

export default function SipSwpCalculatorResult({
	calculator,
}: {
	calculator: SipSwpCalculator;
}) {
	const {
		totalInvestedAmount,
		estimatedTotalValue: estimatedTotalValueAfterSip,
	} = calculateSipResult(
		calculator.lumpsumAmount,
		calculator.monthlySipInvestmentAmount,
		calculator.annualSipStepUpPercent,
		calculator.annualInterestPercent,
		calculator.numberOfSipYears
	);

	const { estimatedWithdrawalAmount, estimatedNumberOfYears } =
		calculateSwpResult(
			estimatedTotalValueAfterSip,
			Math.pow(
				1 + calculator.annualInflationPercent / 100,
				calculator.numberOfSipYears
			) * calculator.currentMonthlyExpenseAmount,
			calculator.annualInterestPercent,
			calculator.annualInflationPercent
		);

	return (
		<div className='mt-4 p-2 bg-green-100 rounded-md w-auto'>
			<table className='w-full'>
				<tbody>
					<tr>
						<td className='text-sm text-green-700 font-semibold'>
							Total Invested Amount:
						</td>
						<td className='text-sm text-green-700 font-semibold text-right'>
							{displayCurrencyAmount(totalInvestedAmount)}
						</td>
					</tr>
					<tr>
						<td className='text-sm text-green-700 font-semibold'>
							Estimated Total Value after SIP:
						</td>
						<td className='text-sm text-green-700 font-semibold text-right'>
							{displayCurrencyAmount(estimatedTotalValueAfterSip)}
						</td>
					</tr>
					<tr>
						<td className='text-sm text-green-700 font-semibold'>
							Estimated Total Withdrawal during SWP:
						</td>
						<td className='text-sm text-green-700 font-semibold text-right'>
							{displayCurrencyAmount(estimatedWithdrawalAmount)}
						</td>
					</tr>
					<tr>
						<td className='text-sm text-green-700 font-semibold'>
							Estimated SWP will last for:
						</td>
						<td className='text-sm text-green-700 font-semibold text-right'>
							{displayYearlyTimeDuration(estimatedNumberOfYears)}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}
