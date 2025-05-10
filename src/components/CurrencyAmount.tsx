import { useCurrencyQuery } from '@/hooks/useCurrencyQuery';
import { useLocaleQuery } from '@/hooks/useLocaleQuery';
import { displayCurrencyAmountText } from '@/lib/utils';
import LoadingComponent from '@/components/LoadingComponent';
import ErrorComponent from '@/components/ErrorComponent';

export default function CurrencyAmount({
	amount,
	notation = 'standard',
	numberOfFractionDigits = 2,
}: {
	amount: number;
	notation?: 'standard' | 'compact';
	numberOfFractionDigits?: number;
}) {
	const currencyQuery = useCurrencyQuery();
	const localeQuery = useLocaleQuery();

	if (currencyQuery.isLoading) {
		return <LoadingComponent loadingMessage='Loading currency...' />;
	}

	if (currencyQuery.isError) {
		return <ErrorComponent errorMessage='Error while loading currency' />;
	}

	if (localeQuery.isLoading) {
		return <LoadingComponent loadingMessage='Loading locale...' />;
	}

	if (localeQuery.isError) {
		return <ErrorComponent errorMessage='Error while loading locale' />;
	}

	return displayCurrencyAmountText(
		localeQuery.data || 'en-US',
		currencyQuery.data || 'USD',
		amount,
		notation,
		numberOfFractionDigits
	);
}
