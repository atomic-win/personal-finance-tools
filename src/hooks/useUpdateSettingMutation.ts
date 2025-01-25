'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useUpdateSettingMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			settingName,
			settingValue,
		}: {
			settingName: string;
			settingValue: string;
		}) => {
			localStorage.setItem(`settings/${settingName}`, settingValue);

			queryClient.invalidateQueries({
				queryKey: ['settings', settingName],
			});
		},
	});
}
