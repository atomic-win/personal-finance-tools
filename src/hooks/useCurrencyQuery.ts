import useSettingQuery from '@/hooks/useSettingQuery';

export default function useCurrencyQuery() {
	return useSettingQuery('currency', 'INR');
}
