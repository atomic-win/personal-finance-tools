'use client';
import { useQuery } from '@tanstack/react-query';

export function useCurrencyQuery() {
	return useQuery({
		queryKey: ['settings', 'currency'],
		queryFn: async () => {
			const currencyFromLocalStorage =
				localStorage.getItem('settings.currency');

			if (currencyFromLocalStorage) {
				return currencyFromLocalStorage;
			}

			const response = await fetch('https://ipapi.co/json/');
			const data = await response.json();

			const currencyFromApi = data.currency as string;
			if (currencyFromApi) {
				return currencyFromApi;
			}

			return 'USD';
		},
		refetchIntervalInBackground: true,
	});
}
