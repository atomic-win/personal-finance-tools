import { useCurrencyQuery } from '@/hooks/useCurrencyQuery';
import { useLocaleQuery } from '@/hooks/useLocaleQuery';
import { displayCurrencyAmountText } from '@/lib/utils';

export default function CurrencyAmount({
	amount,
	notation = 'standard',
	numberOfFractionDigits = 2,
}: {
	amount: number;
	notation?: 'standard' | 'compact';
	numberOfFractionDigits?: number;
}) {
	const { data: currency, isLoading: isLoadingCurrency } = useCurrencyQuery();
	const { data: locale, isLoading: isLoadingLocale } = useLocaleQuery();

	if (isLoadingCurrency || isLoadingLocale || !currency || !locale) {
		return '';
	}

	return displayCurrencyAmountText(
		locale,
		currency,
		amount,
		notation,
		numberOfFractionDigits
	);
}
