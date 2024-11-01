import { useQuery } from '@tanstack/react-query';

export default function useAccessTokenQuery() {
	return useQuery({
		queryKey: ['accessToken'],
		queryFn: () => (localStorage.getItem('accessToken') as string) ?? '',
		refetchInterval: 1000,
		refetchIntervalInBackground: true,
	});
}
