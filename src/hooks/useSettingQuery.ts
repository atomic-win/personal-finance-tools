import { useQuery } from '@tanstack/react-query';

export default function useSettingQuery(
	settingName: string,
	defaultValue: string
) {
	return useQuery({
		queryKey: ['settings', settingName],
		initialData: defaultValue,
		queryFn: () =>
			localStorage.getItem(`settings/${settingName}`) ?? defaultValue,
		refetchIntervalInBackground: true,
	});
}
