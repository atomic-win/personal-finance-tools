import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';
import { useRouter } from 'next/navigation';

export const useLogInMutation = () => {
	const primalApiClient = usePrimalApiClient();
	const queryClient = useQueryClient();
	const { replace } = useRouter();

	return useMutation({
		mutationFn: async (idToken: string) => {
			const response = await primalApiClient.post('/authentication/signin', {
				idToken: idToken,
			});

			const accessToken = response.data.accessToken;
			localStorage.setItem('accessToken', accessToken);

			queryClient.removeQueries();
			queryClient.clear();

			replace('/');
		},
	});
};
