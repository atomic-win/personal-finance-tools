import { useQuery } from '@tanstack/react-query';

export default function useSettingQuery(
	settingName: string,
	defaultValue: string
) {
	return useQuery({
		queryKey: [
			'settings',
			settingName,
			{
				defaultValue,
			},
		],
		initialData: defaultValue,
		queryFn: () =>
			localStorage.getItem(`settings/${settingName}`) || defaultValue,
		refetchIntervalInBackground: true,
	});
}

export function useSetting(settingName: string) {
	return typeof window === 'undefined'
		? null
		: localStorage.getItem(`settings/${settingName}`);
}
