import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';
import { useCurrencyQuery } from '@/hooks/useCurrencyQuery';

export default function withCurrency<T extends { currency: string }>(
	Component: React.ComponentType<T>
) {
	return function WithCurrency(props: Omit<T, 'currency'>) {
		const { data: currency, isFetching, error } = useCurrencyQuery();

		if (isFetching) {
			return <LoadingComponent loadingMessage='Fetching currency' />;
		}

		if (error || !currency) {
			return <ErrorComponent errorMessage='Failed while fetching currency' />;
		}

		return <Component {...(props as T)} currency={currency} />;
	};
}
