'use client';
import { LOCALE_OPTIONS } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';

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

				const locales = _.uniq([
					...((data.languages as string).split(',') || []),
					'en',
					'en-US',
				]).filter((locale) => LOCALE_OPTIONS.includes(locale));

				const supportedLocales = Intl.NumberFormat.supportedLocalesOf(locales, {
					localeMatcher: 'best fit',
				});

				supportedLocales.sort((a, b) => b.length - a.length);

				return supportedLocales[0] || DEFAULT_LOCALE;
			} catch (error) {
				console.error('Error fetching locale data:', error);
				return DEFAULT_LOCALE;
			}
		},
		refetchIntervalInBackground: true,
	});
}
