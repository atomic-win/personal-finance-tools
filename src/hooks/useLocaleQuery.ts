'use client';

import useSettingQuery, { useSetting } from '@/hooks/useSettingQuery';

export function useLocaleQuery(defaultLocale: string = '') {
	return useSettingQuery('locale', defaultLocale || 'en-US');
}

export function useLocale() {
	return useSetting('locale');
}
