'use client';
import useSettingQuery, { useSetting } from '@/hooks/useSettingQuery';

export function useCurrencyQuery(defaultValue: string = '') {
	return useSettingQuery('currency', defaultValue || 'USD');
}

export function useCurrency() {
	return useSetting('currency');
}
