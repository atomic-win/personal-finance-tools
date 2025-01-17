import { z } from 'zod';

export type CalculatorType = 'sip' | 'swp' | 'sip-swp' | 'fixed-deposit';

export const FdCalculatorSchema = z.object({
	principalAmount: z.coerce.number().positive({
		message: 'Principal Amount must be greater than or equal to 0',
	}),
	annualInterestRate: z.coerce.number().positive({
		message: 'Annual Interest Rate must be greater than or equal to 0',
	}),
	numberOfYears: z.coerce
		.number()
		.positive({
			message: 'Time Period must be greater than or equal to 0 years',
		})
		.int({
			message: 'Time Period must be an integer',
		}),
	compoundingFrequency: z.coerce
		.number()
		.positive({
			message: 'Compounding Frequency must be greater than or equal to 1',
		})
		.int({
			message: 'Compounding Frequency must be an integer',
		}),
});

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

export const swpCalculatorSchema = z.object({
	totalInvestmentAmount: z.coerce.number().min(1, {
		message: 'Total Investment cannot be less than 1',
	}),
	monthlyWithdrawalAmount: z.coerce
		.number()
		.min(1, { message: 'Monthly Withdrawal cannot be less than 1' }),
	annualInterestPercent: z.coerce.number().min(-99, {
		message: 'Annual Interest Percent cannot be less than or equal to -100%',
	}),
	annualInflationPercent: z.coerce.number().min(-99, {
		message: 'Annual Inflation Percent cannot be less than or equal to -100%',
	}),
});

export const sipSwpCalculatorSchema = z.object({
	lumpsumAmount: z.coerce.number().min(0, {
		message: 'Lumpsum Amount cannot be less than 0',
	}),
	monthlySipInvestmentAmount: z.coerce
		.number()
		.min(1, { message: 'Monthly SIP Investment cannot be less than 1' }),
	annualSipStepUpPercent: z.coerce.number().min(-99, {
		message: 'Annual SIP Step-Up Percent cannot be less than or equal to -100%',
	}),
	annualInterestPercent: z.coerce.number().min(-99, {
		message: 'Annual Interest Percent cannot be less than or equal to -100%',
	}),
	numberOfSipYears: z.coerce
		.number()
		.min(0, { message: 'SIP Investment Duration cannot be negative' }),
	currentMonthlyExpenseAmount: z.coerce
		.number()
		.min(1, { message: 'Current Monthly Expense cannot be less than 1' }),
	annualInflationPercent: z.coerce.number().min(-99, {
		message: 'Annual Inflation Percent cannot be less than or equal to -100%',
	}),
});

export type Calculator = {
	id: string;
	type: CalculatorType;
};

export type FdCalculator = Calculator & {
	type: 'fixed-deposit';
} & z.infer<typeof FdCalculatorSchema>;

export type SipCalculator = Calculator & {
	type: 'sip';
} & z.infer<typeof sipCalculatorSchema>;

export type SwpCalculator = Calculator & {
	type: 'swp';
} & z.infer<typeof swpCalculatorSchema>;

export type SipSwpCalculator = Calculator & {
	type: 'sip-swp';
} & z.infer<typeof sipSwpCalculatorSchema>;
