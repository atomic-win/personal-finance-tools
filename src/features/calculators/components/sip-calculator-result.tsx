import CalculatorResultTableRow from '@/features/calculators/components/calculator-result-table-row';
import type { SipCalculator } from '@/features/calculators/lib/types';
import { calculateSipResult } from '@/features/calculators/lib/utils';

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
		<div className='mt-4 p-2 bg-green-100 rounded-md w-auto'>
			<table className='w-full'>
				<tbody>
					<CalculatorResultTableRow
						label='Total Invested Amount'
						value={result.totalInvestedAmount}
						type='amount'
					/>
					<CalculatorResultTableRow
						label='Estimated Returns'
						value={result.estimatedReturns}
						type='amount'
					/>
					<CalculatorResultTableRow
						label='Estimated Total Value'
						value={result.estimatedTotalValue}
						type='amount'
					/>
				</tbody>
			</table>
		</div>
	);
}
