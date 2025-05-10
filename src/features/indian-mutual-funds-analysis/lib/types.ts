export type MutualFund = {
	schemeCode: number;
	schemeName: string;
	earliestDate: string;
	lastDate: string;
	navs: Map<string, number>;
};

export type ReturnType = 'simple' | 'sip' | 'swp';

export type ReturnRequest = {
	investmentDuration: PresetTimeDurations;
	returnType: ReturnType;
	frequency: Frequency;
	stepUpFrequency: Frequency;
	stepUpRatio: number;
};

export enum Frequency {
	Weekly = 'weekly',
	Biweekly = 'biweekly',
	Monthly = 'monthly',
	Quarterly = 'quarterly',
	Yearly = 'yearly',
}

export type RollingReturn = {
	noData: boolean;
	avgReturn: number;
	minReturn: number;
	percentiles: Record<number, number>;
	maxReturn: number;
};

export type Return = {
	schemeCode: number;
	date: string;
	return: number;
};

export enum PresetTimeDurations {
	OneMonth = '1Month',
	TwoMonths = '2Months',
	ThreeMonths = '3Months',
	SixMonths = '6Months',
	OneYear = '1Year',
	TwoYears = '2Years',
	ThreeYears = '3Years',
	FiveYears = '5Years',
	TenYears = '10Years',
	FifteenYears = '15Years',
	TwentyYears = '20Years',
}
