export type MutualFund = {
	schemeCode: number;
	schemeName: string;
	earliestDate: string;
	lastDate: string;
	navs: Map<string, number>;
};

export type ReturnType = 'cagr' | 'sip' | 'swp';

export type ReturnRequest = {
	investmentDuration: PresetTimeDurations;
	returnType: ReturnType;
	frequency: Frequency;
	stepUpFrequency: Frequency;
	stepUpRatio: number;
	rollingWindow: PresetTimeDurations;
	rollingReturnType: RollingReturnType;
};

export enum Frequency {
	Weekly = 'weekly',
	Biweekly = 'biweekly',
	Monthly = 'monthly',
	Quarterly = 'quarterly',
	Yearly = 'yearly',
}

export enum RollingReturnType {
	Min = 'min',
	Avg = 'avg',
	Max = 'max',
	P25 = 'p25',
	P50 = 'p50',
	P75 = 'p75',
	P90 = 'p90',
}

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
