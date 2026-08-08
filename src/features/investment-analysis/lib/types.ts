export type InstrumentType = 'mutual-fund' | 'index';

export type Instrument = {
	id: string;
	name: string;
	type: InstrumentType;
	currency: string;
	earliestDate: string;
	lastDate: string;
	prices: Record<string, number>;
};

export type MutualFundListItem = {
	schemeCode: number;
	schemeName: string;
};

export type SupportedIndex = {
	symbol: string;
	name: string;
	currency: string;
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
	instrumentId: string;
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
