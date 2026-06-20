import { useQuery } from '@tanstack/react-query';

export function useCurrencyQuery() {
	return useQuery({
		queryKey: ['settings', 'currency'],
		queryFn: () => localStorage.getItem('settings.currency'),
		refetchIntervalInBackground: true,
	});
}
