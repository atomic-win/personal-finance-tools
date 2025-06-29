import axios from 'axios';
import { Instrument } from '../lib/types';
import { calculateInstrument } from '../lib/utils';

const apiClient = axios.create({
	validateStatus: () => true,
});

export async function getIndexesList() {
	const data = (await apiClient.get('/api/indexes/all')).data as {
		symbol: string;
		name: string;
	}[];

	return data.map(
		(x) =>
			({
				symbol: x.symbol,
				name: x.name,
			} as Instrument)
	);
}

export async function getIndexRates(symbol: string) {
	const apiResponse = (await apiClient.get(`/api/indexes?symbol=${symbol}`))
		.data as {
		symbol: string;
		name: string;
		data: { date: string; rate: number }[];
	};

	if (!apiResponse) {
		return {} as Instrument;
	}

	return calculateInstrument({
		type: 'Index',
		...apiResponse,
	});
}
