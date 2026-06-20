import CalculatorResultTableRow from '@/features/calculators/components/calculator-result-table-row';
import type { SwpCalculator } from '@/features/calculators/lib/types';
import { calculateSwpResult } from '@/features/calculators/lib/utils';

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
		<div className='mt-4 p-2 bg-green-100 rounded-md w-auto'>
			<table className='w-full'>
				<tbody>
					<CalculatorResultTableRow
						label='Total Invested Amount'
						value={calculator.totalInvestmentAmount}
						type='amount'
					/>
					<CalculatorResultTableRow
						label='Estimated Total Withdrawal'
						value={result.estimatedWithdrawalAmount}
						type='amount'
					/>
					<CalculatorResultTableRow
						label='Estimated SWP will last for'
						value={result.estimatedNumberOfYears}
						type='year'
					/>
				</tbody>
			</table>
		</div>
	);
}
