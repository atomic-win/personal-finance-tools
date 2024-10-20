import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { useLogOutMutation } from './useLogOutMutation';

export const usePrimalApiClient = () => {
	const queryClient = useQueryClient();
	const logOutMutation = useLogOutMutation();

	const accessToken = queryClient.getQueryData(['accessToken']);

	const headers = {
		'Content-type': 'application/json',
		Authorization: accessToken ? `Bearer ${accessToken}` : '',
	};

	const apiClient = axios.create({
		baseURL: 'http://localhost:5185/api',
		headers: headers,
		validateStatus: () => true,
	});

	apiClient.interceptors.response.use(
		async (response) => {
			if (response.status === 401) {
				await logOutMutation.mutateAsync();
			}
			return response;
		},
		async (error) => {
			if (error.response.status === 401) {
				logOutMutation.mutateAsync();
			}
			return error;
		}
	);

	return apiClient;
};
