import { Instrument, InstrumentType } from '@/features/returns/lib/types';
import axios from 'axios';
import _ from 'lodash';
import { calculateInstrument } from '../lib/utils';
import { DateTime } from 'luxon';

const mfApiClient = axios.create({
	baseURL: 'https://api.mfapi.in',
	validateStatus: () => true,
});

export async function getMutualFundsList() {
	const data = (await mfApiClient.get('mf')).data as {
		schemeCode: number;
		schemeName: string;
	}[];

	const mutualFunds = data.map(
		(x) =>
			({
				symbol: x.schemeCode.toString(),
				name: x.schemeName,
				type: InstrumentType.MutualFund,
			} as Instrument)
	);

	return _.uniqBy(mutualFunds, (x) => x.symbol);
}

export async function getMutualFundRates(schemeCode: number) {
	const apiResponse = (await mfApiClient.get(`mf/${schemeCode}`)).data as {
		meta: { scheme_code: number; scheme_name: string };
		data: { date: string; nav: number }[];
	};

	if (!apiResponse || !apiResponse.data) {
		return {} as Instrument;
	}

	return calculateInstrument({
		symbol: apiResponse.meta.scheme_code.toString(),
		name: apiResponse.meta.scheme_name,
		type: InstrumentType.MutualFund,
		data: apiResponse.data.map((x) => ({
			date: DateTime.fromFormat(x.date, 'dd-MM-yyyy').toISODate()!,
			rate: x.nav,
		})),
	});
}
