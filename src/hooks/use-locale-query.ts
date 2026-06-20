import { useQuery } from '@tanstack/react-query';

export function useLocaleQuery() {
	return useQuery({
		queryKey: ['settings', 'locale'],
		queryFn: () => localStorage.getItem('settings.locale'),
		refetchIntervalInBackground: true,
	});
}
