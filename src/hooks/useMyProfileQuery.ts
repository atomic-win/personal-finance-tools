import { useQuery } from '@tanstack/react-query';
import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';
import { UserProfile } from '@/lib/types';

export const useMyProfileQuery = () => {
	const primalApiClient = usePrimalApiClient();

	return useQuery({
		queryKey: ['users', 'me', 'profile'],
		queryFn: async () => {
			const response = await primalApiClient.get('users/me/profile');
			return response.data as UserProfile;
		},
	});
};
