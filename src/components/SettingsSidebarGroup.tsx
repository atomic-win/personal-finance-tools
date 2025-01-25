'use client';
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	useSidebar,
} from '@/components/ui/sidebar';
import { useCurrencyQuery } from '@/hooks/useCurrencyQuery';
import useUpdateSettingMutation from '@/hooks/useUpdateSettingMutation';
import {
	Select,
	SelectContent,
	SelectIcon,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { ChevronRight } from 'lucide-react';
import { useIpQuery } from '@/hooks/useIpQuery';
import _ from 'lodash';
import { useLocaleQuery } from '@/hooks/useLocaleQuery';

export default function SettingsSidebarGroup() {
	const { isMobile } = useSidebar();

	const { data: ipData, isLoading: isIpDataLoading } = useIpQuery();

	const { data: currency, isLoading: isCurrencyLoading } = useCurrencyQuery();
	const { data: locale, isLoading: isLocaleLoading } = useLocaleQuery();
	const { mutate: updateSetting } = useUpdateSettingMutation();

	if (
		isCurrencyLoading ||
		isLocaleLoading ||
		isIpDataLoading ||
		!currency ||
		!locale ||
		!ipData
	) {
		return null;
	}

	const settings = [
		{
			name: 'currency',
			title: 'Currency',
			value: currency,
			options: Intl.supportedValuesOf('currency'),
		},
		{
			name: 'locale',
			title: 'Language',
			value: locale,
			options: calculateLocaleOptions(!!!ipData ? [] : ipData.languages),
		},
	];

	return (
		<SidebarGroup className='mt-auto'>
			<SidebarGroupLabel>Settings</SidebarGroupLabel>
			<SidebarMenu>
				{settings.map((setting) => (
					<Select
						key={setting.name}
						onValueChange={(x) =>
							updateSetting({ settingName: setting.name, settingValue: x })
						}
						value={setting.value}>
						<SelectTrigger
							className='w-full rounded-lg sm:ml-auto'
							aria-label='Select a value'>
							<SelectValue>
								{setting.title} - {setting.value}
							</SelectValue>
							<SelectIcon>
								<ChevronRight className='h-4 w-4 opacity-50' />
							</SelectIcon>
						</SelectTrigger>
						<SelectContent
							className='rounded-xl'
							side={isMobile ? 'bottom' : 'right'}
							align={isMobile ? 'end' : 'start'}>
							{setting.options.map((option) => (
								<SelectItem key={option} value={option} className='rounded-lg'>
									{option}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}

function calculateLocaleOptions(ipDataLocales: string[]) {
	const locales = _.uniq([...ipDataLocales, 'en', 'en-US']).filter(
		(locale) => locale === 'en' || locale.startsWith('en-')
	);

	const supportedLocales = Intl.NumberFormat.supportedLocalesOf(locales, {
		localeMatcher: 'best fit',
	});

	supportedLocales.sort((a, b) => b.length - a.length);
	return supportedLocales;
}
