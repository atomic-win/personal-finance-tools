export type SipCalculator = {
	id: string;
	lumpsumAmount: number;
	monthlyInvestment: number;
	annualStepUpPercent: number;
	annualInterestPercent: number;
	numberOfYears: number;
};

export type SwpCalculator = {
	id: string;
	totalInvestmentAmount: number;
	monthlyWithdrawalAmount: number;
	annualInterestPercent: number;
	annualInflationPercent: number;
};
