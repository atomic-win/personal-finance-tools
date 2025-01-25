'use client';
import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';

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

			const locales = (data.languages as string).split(',');

			const uniqLocales = _.uniq([...(locales || []), 'en', 'en-US']).filter(
				(locale) => locale === 'en' || locale.startsWith('en-')
			);

			const supportedLocales = Intl.NumberFormat.supportedLocalesOf(
				uniqLocales,
				{
					localeMatcher: 'best fit',
				}
			);

			supportedLocales.sort((a, b) => b.length - a.length);

			return supportedLocales[0];
		},
		refetchIntervalInBackground: true,
	});
}
