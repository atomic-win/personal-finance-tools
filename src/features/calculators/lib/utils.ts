const yearlyTimeDurationFormat = new Intl.NumberFormat('en-IN', {
	style: 'unit',
	unit: 'year',
	unitDisplay: 'long',
	maximumFractionDigits: 1,
});

export function displayCurrencyAmount(
	amount: number,
	maximumFractionDigits: number = 2,
	notation: 'standard' | 'compact' = 'compact'
) {
	return Intl.NumberFormat('en-IN', {
		style: 'currency',
		currency: 'INR',
		currencyDisplay: 'symbol',
		maximumFractionDigits,
		notation,
	}).format(amount);
}

export function displayYearlyTimeDuration(years: number): string {
	return yearlyTimeDurationFormat.format(years);
}

export function calculateFdResult(
	principalAmount: number,
	annualInterestRate: number,
	numberOfYears: number,
	compoundingFrequency: number
) {
	const maturityAmount =
		principalAmount *
		Math.pow(
			1 + annualInterestRate / (100 * compoundingFrequency),
			compoundingFrequency * numberOfYears
		);

	const interestEarned = maturityAmount - principalAmount;
	const principalAmountPercent =
		(principalAmount / Math.max(1, maturityAmount)) * 100;
	const interestEarnedPercent =
		(interestEarned / Math.max(1, maturityAmount)) * 100;

	return {
		maturityAmount,
		interestEarned,
		principalAmountPercent,
		interestEarnedPercent,
	};
}

export function calculateRdResult(
	monthlyDepositAmount: number,
	annualInterestRate: number,
	numberOfYears: number
) {
	const monthlyInterestRate = annualInterestRate / 12 / 100;

	let totalDepositAmount = 0;
	let maturityAmount = 0;

	for (let year = 1; year <= numberOfYears; year++) {
		for (let month = 1; month <= 12; month++) {
			totalDepositAmount += monthlyDepositAmount;
			maturityAmount += monthlyDepositAmount;
			maturityAmount *= 1 + monthlyInterestRate;
		}
	}

	const interestEarned = maturityAmount - totalDepositAmount;

	const totalDepositAmountPercent =
		(totalDepositAmount / Math.max(1, maturityAmount)) * 100;
	const interestEarnedPercent =
		(interestEarned / Math.max(1, maturityAmount)) * 100;

	return {
		maturityAmount,
		totalDepositAmount,
		interestEarned,
		totalDepositAmountPercent,
		interestEarnedPercent,
	};
}

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
	annualInterestPercent: number,
	annualInflationPercent: number
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
