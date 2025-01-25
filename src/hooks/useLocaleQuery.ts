'use client';
import { calculateLocaleOptions } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

export function useLocaleQuery() {
	return useQuery({
		queryKey: ['settings', 'locale'],
		queryFn: async () => {
			const localeFromLocalStorage = localStorage.getItem('settings.locale');
			if (localeFromLocalStorage) {
				return localeFromLocalStorage;
			}

			const response = await fetch('https://ipapi.co/json/');
			const data = await response.json();

			const locales = calculateLocaleOptions(
				(data.languages as string).split(',') || []
			);

			return locales[0];
		},
		refetchIntervalInBackground: true,
	});
}
