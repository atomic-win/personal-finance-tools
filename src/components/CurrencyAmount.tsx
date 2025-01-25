import { useCurrencyQuery } from '@/hooks/useCurrencyQuery';
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
	const { data: currency, isLoading } = useCurrencyQuery();

	if (isLoading || !currency) {
		return '';
	}

	return displayCurrencyAmountText(
		navigator.language,
		currency,
		amount,
		notation,
		numberOfFractionDigits
	);
}
