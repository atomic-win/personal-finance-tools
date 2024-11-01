'use client';
import axios from 'axios';
import { useLogOutMutation } from '@/hooks/useLogOutMutation';
import useAccessTokenQuery from '@/hooks/useAccessTokenQuery';

export const usePrimalApiClient = () => {
	const { data: accessToken } = useAccessTokenQuery();
	const logOutMutation = useLogOutMutation();

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
