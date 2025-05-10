'use client';
import { useQuery } from '@tanstack/react-query';

const DEFAULT_CURRENCY = 'USD';

export function useCurrencyQuery() {
	return useQuery({
		queryKey: ['settings', 'currency'],
		queryFn: async () => {
			const currencyFromLocalStorage =
				localStorage.getItem('settings.currency');

			if (currencyFromLocalStorage) {
				return currencyFromLocalStorage;
			}

			try {
				const response = await fetch('https://ipapi.co/json/');
				if (!response.ok) {
					console.error(
						'Failed to fetch currency data from ipapi.co:',
						response.statusText
					);

					return DEFAULT_CURRENCY;
				}

				const data = await response.json();
				const currencyFromApi = data.currency as string;
				if (currencyFromApi) {
					return currencyFromApi;
				}

				return DEFAULT_CURRENCY;
			} catch (error) {
				console.error('Error fetching currency data:', error);
				return DEFAULT_CURRENCY;
			}
		},
		refetchIntervalInBackground: true,
	});
}
