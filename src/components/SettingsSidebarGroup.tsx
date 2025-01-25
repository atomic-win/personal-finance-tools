'use client';
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	useSidebar,
} from '@/components/ui/sidebar';
import { useCurrency, useCurrencyQuery } from '@/hooks/useCurrencyQuery';
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
import { useLocale, useLocaleQuery } from '@/hooks/useLocaleQuery';
import { useEffect } from 'react';

export default function SettingsSidebarGroup() {
	const { isMobile } = useSidebar();

	const storedCurrency = useCurrency();
	const storedLocale = useLocale();

	const { data: ipData, isLoading: isIpDataLoading } = useIpQuery();
	const localeOptions = calculateLocaleOptions(
		!!!ipData ? [] : ipData.languages
	);

	const bestLocaleOption = localeOptions[0];

	const { data: currency, isLoading: isCurrencyLoading } = useCurrencyQuery(
		!!!ipData ? '' : ipData.currency
	);
	const { data: locale, isLoading: isLocaleLoading } =
		useLocaleQuery(bestLocaleOption);
	const { mutate: updateSetting } = useUpdateSettingMutation();

	useEffect(() => {
		if (!!!storedCurrency && !!currency) {
			updateSetting({ settingName: 'currency', settingValue: currency });
		}
	}, [currency, storedCurrency, updateSetting]);

	useEffect(() => {
		if (!!!storedLocale && !!locale) {
			updateSetting({ settingName: 'locale', settingValue: locale });
		}
	}, [locale, storedLocale, updateSetting]);

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
			title: 'Locale',
			value: locale,
			options: localeOptions,
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
