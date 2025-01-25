import { Currency } from '@/lib/types';
import useSettingQuery from '@/hooks/useSettingQuery';

export default function useCurrencyQuery() {
	return useSettingQuery('currency', Currency.INR);
}
