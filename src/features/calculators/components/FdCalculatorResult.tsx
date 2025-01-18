import { FdCalculator } from '@/features/calculators/lib/types';
import { calculateFdResult } from '@/features/calculators/lib/utils';
import CalculatorResultTableRow from '@/features/calculators/components/CalculatorResultTableRow';

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
					<CalculatorResultTableRow
						label='Principal Amount'
						value={calculator.principalAmount}
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
