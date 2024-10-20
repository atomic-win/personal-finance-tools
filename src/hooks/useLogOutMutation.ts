import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useLogOutMutation = () => {
	const queryClient = useQueryClient();
	const { replace } = useRouter();

	return useMutation({
		mutationFn: async () => {
			localStorage.removeItem('accessToken');
			await queryClient.invalidateQueries();
			replace('/');
		},
	});
};
