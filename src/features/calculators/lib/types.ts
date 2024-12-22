export type CalculatorType = 'sip' | 'swp' | 'sip-swp';

export type Calculator = {
	id: string;
	type: CalculatorType;
};

export type SipCalculator = Calculator & {
	type: 'sip';
	lumpsumAmount: number;
	monthlyInvestmentAmount: number;
	annualStepUpPercent: number;
	annualInterestPercent: number;
	numberOfYears: number;
};

export type SwpCalculator = Calculator & {
	type: 'swp';
	totalInvestmentAmount: number;
	monthlyWithdrawalAmount: number;
	annualInterestPercent: number;
	annualInflationPercent: number;
};

export type SipSwpCalculator = Calculator & {
	type: 'sip-swp';
	lumpsumAmount: number;
	monthlySipInvestmentAmount: number;
	annualSipStepUpPercent: number;
	annualInterestPercent: number;
	numberOfSipYears: number;
	monthlySwpWithdrawalAmount: number;
	annualInflationPercent: number;
};
