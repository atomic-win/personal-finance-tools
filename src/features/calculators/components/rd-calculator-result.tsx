import CalculatorResultTableRow from '@/features/calculators/components/calculator-result-table-row';
import type { RdCalculator } from '@/features/calculators/lib/types';
import { calculateRdResult } from '@/features/calculators/lib/utils';

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
					<CalculatorResultTableRow
						label='Total Deposit Amount'
						value={totalDepositAmount}
						type='amount'
					/>
					<CalculatorResultTableRow
						label='Interest Earned'
						value={interestEarned}
						type='amount'
					/>
					<CalculatorResultTableRow
						label='Maturity Amount'
						value={maturityAmount}
						type='amount'
					/>
				</tbody>
			</table>
		</div>
	);
}
