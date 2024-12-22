import { z } from 'zod';

export type CalculatorType = 'sip' | 'swp' | 'sip-swp';

export const sipCalculatorSchema = z.object({
	lumpsumAmount: z.coerce.number().min(0, {
		message: 'Lumpsum Amount cannot be less than 0',
	}),
	monthlyInvestmentAmount: z.coerce
		.number()
		.min(1, { message: 'Monthly Investment cannot be less than 1' }),
	annualStepUpPercent: z.coerce.number().min(-99, {
		message: 'Annual Step-Up Percent cannot be less than or equal to -100%',
	}),
	annualInterestPercent: z.coerce.number().min(-99, {
		message: 'Annual Interest Percent cannot be less than or equal to -100%',
	}),
	numberOfYears: z.coerce
		.number()
		.min(1, { message: 'Investment Duration cannot be less than 1 year' }),
});

export type Calculator = {
	id: string;
	type: CalculatorType;
};

export type SipCalculator = Calculator & {
	type: 'sip';
} & z.infer<typeof sipCalculatorSchema>;

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
