export function calculateSipResult(
	lumpsumAmount: number,
	monthlyInvestment: number,
	annualInterestPercent: number,
	annualStepUpPercent: number,
	numberOfYears: number
) {
	const annualInterestRate = annualInterestPercent / 100;
	const monthlyInterestRate = Math.pow(1 + annualInterestRate, 1 / 12) - 1;

	let totalInvestedAmount = lumpsumAmount;
	let estimatedTotalValue = lumpsumAmount;

	for (let year = 0; year < numberOfYears; ++year) {
		for (let month = 0; month < 12; ++month) {
			totalInvestedAmount += monthlyInvestment;
			estimatedTotalValue += monthlyInvestment;
			estimatedTotalValue *= 1 + monthlyInterestRate;
		}
		monthlyInvestment *= 1 + annualStepUpPercent / 100;
	}

	const estimatedReturns = estimatedTotalValue - totalInvestedAmount;
	const investedAmountPercent =
		(totalInvestedAmount / Math.max(1, estimatedTotalValue)) * 100;
	const estimatedReturnsPercent =
		(estimatedReturns / Math.max(1, estimatedTotalValue)) * 100;

	return {
		totalInvestedAmount,
		estimatedTotalValue,
		estimatedReturns,
		investedAmountPercent,
		estimatedReturnsPercent,
	};
}

export function calculateSwpResult(
	totalInvestment: number,
	monthlyWithdrawal: number,
	annualInflationPercent: number,
	annualInterestPercent: number
) {
	const monthlyInterestRate =
		Math.pow(1 + annualInterestPercent / 100, 1 / 12) - 1;
	const annualInflationRate = annualInflationPercent / 100;

	let withdrawalAmount = 0;
	let balanceAmount = totalInvestment;
	let numberOfMonths = 0;

	for (let year = 0; year < 10000 && balanceAmount > 0; ++year) {
		for (let month = 0; month < 12 && balanceAmount > 0; ++month) {
			const currentMonthWithdrawal = Math.min(monthlyWithdrawal, balanceAmount);
			++numberOfMonths;

			withdrawalAmount += currentMonthWithdrawal;
			balanceAmount -= currentMonthWithdrawal;
			balanceAmount *= 1 + monthlyInterestRate;
		}
		monthlyWithdrawal *= 1 + annualInflationRate;
	}

	if (withdrawalAmount > Math.pow(10, 20)) {
		withdrawalAmount = Infinity;
		numberOfMonths = Infinity;
	}

	return {
		estimatedWithdrawalAmount: withdrawalAmount,
		estimatedNumberOfYears: numberOfMonths / 12,
	};
}
