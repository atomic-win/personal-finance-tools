'use client';
import { calculateLocaleOptions } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

const DEFAULT_LOCALE = 'en-US';

export function useLocaleQuery() {
	return useQuery({
		queryKey: ['settings', 'locale'],
		queryFn: async () => {
			const localeFromLocalStorage = localStorage.getItem('settings.locale');
			if (localeFromLocalStorage) {
				return localeFromLocalStorage;
			}

			try {
				const response = await fetch('https://ipapi.co/json/');
				if (!response.ok) {
					console.error(
						'Failed to fetch locale data from ipapi.co',
						response.statusText
					);

					return DEFAULT_LOCALE;
				}

				const data = await response.json();

				const locales = calculateLocaleOptions(
					(data.languages as string).split(',') || []
				);

				return locales[0];
			} catch (error) {
				console.error('Error fetching locale data:', error);
				return DEFAULT_LOCALE;
			}
		},
		refetchIntervalInBackground: true,
	});
}
