import { SipSwpCalculator } from '@/features/calculators/lib/types';
import {
	calculateSipResult,
	calculateSwpResult,
} from '@/features/calculators/lib/utils';
import CalculatorResultTableRow from '@/features/calculators/components/CalculatorResultTableRow';

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
					<CalculatorResultTableRow
						label='Total Invested Amount'
						value={totalInvestedAmount}
						type='amount'
					/>
					<CalculatorResultTableRow
						label='Estimated Total Value after SIP'
						value={estimatedTotalValueAfterSip}
						type='amount'
					/>
					<CalculatorResultTableRow
						label='Estimated Total Withdrawal during SWP'
						value={estimatedWithdrawalAmount}
						type='amount'
					/>
					<CalculatorResultTableRow
						label='Estimated SWP will last for'
						value={estimatedNumberOfYears}
						type='year'
					/>
				</tbody>
			</table>
		</div>
	);
}
