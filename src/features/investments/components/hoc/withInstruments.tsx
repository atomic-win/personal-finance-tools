'use client';
import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';
import useInstrumentByIdQueries from '@/features/investments/hooks/instruments';
import { Instrument, Asset } from '@/features/investments/lib/types';

export default function withInstruments<
	T extends { instruments: Instrument[]; assets: Asset[] }
>(Component: React.ComponentType<T>) {
	return function WithInstruments(props: Omit<T, 'instruments'>) {
		const instrumentResults = useInstrumentByIdQueries(
			(props.assets || []).map((asset) => asset.instrumentId)
		);

		if (instrumentResults.some((result) => result.isFetching)) {
			return <LoadingComponent loadingMessage='Fetching instruments' />;
		}

		if (
			instrumentResults.some((result) => result.error) ||
			!instrumentResults.every((result) => result.data)
		) {
			return <ErrorComponent errorMessage='Failed to fetch instruments' />;
		}

		const instruments = instrumentResults.map((result) => result.data!);

		return <Component {...(props as T)} instruments={instruments} />;
	};
}
