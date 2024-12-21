export type SIPCalculator = {
	id: string;
	lumpsumAmount: number;
	monthlyInvestment: number;
	annualStepUpPercent: number;
	annualInterestPercent: number;
	numberOfYears: number;
};

export type SWPCalculator = {
	id: string;
	totalInvestmentAmount: number;
	monthlyWithdrawalAmount: number;
	annualInterestPercent: number;
	annualInflationPercent: number;
};
