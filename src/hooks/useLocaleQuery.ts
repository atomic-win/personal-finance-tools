import useSettingQuery from '@/hooks/useSettingQuery';

export default function useLocaleQuery() {
	return useSettingQuery('currency', 'en');
}
