'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useUpdateSettingMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			settingName,
			setttingValue,
		}: {
			settingName: string;
			setttingValue: string;
		}) => {
			localStorage.setItem(`settings/${settingName}`, setttingValue);

			queryClient.invalidateQueries({
				queryKey: ['settings', settingName],
			});
		},
	});
}
