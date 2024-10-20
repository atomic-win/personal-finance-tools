import { Currency } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export default function useCurrencyQuery() {
	return useQuery({
		queryKey: ['currency'],
		queryFn: () =>
			(localStorage.getItem('currency') as Currency) ?? Currency.INR,
	});
}
