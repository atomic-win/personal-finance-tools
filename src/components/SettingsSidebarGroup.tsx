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
import { useLocaleQuery } from '@/hooks/useLocaleQuery';
import { LOCALE_OPTIONS } from '@/lib/utils';
import LoadingComponent from '@/components/LoadingComponent';
import ErrorComponent from '@/components/ErrorComponent';
import { useEffect } from 'react';
import _ from 'lodash';

export default function SettingsSidebarGroup() {
	const { isMobile } = useSidebar();

	const ipQuery = useIpQuery();
	const currencyQuery = useCurrencyQuery();
	const localeQuery = useLocaleQuery();

	const { mutate: updateSetting } = useUpdateSettingMutation();

	useEffect(() => {
		if (ipQuery.data?.currency && !currencyQuery.data) {
			updateSetting({
				settingName: 'currency',
				settingValue: ipQuery.data.currency,
			});
		}

		if (ipQuery.data?.languages && !localeQuery.data) {
			const locales = _.uniq([
				...(ipQuery.data.languages || []),
				'en',
				'en-US',
			]).filter((locale) => LOCALE_OPTIONS.includes(locale));

			const supportedLocales = Intl.NumberFormat.supportedLocalesOf(locales, {
				localeMatcher: 'best fit',
			});

			supportedLocales.sort((a, b) => b.length - a.length);

			if (supportedLocales.length !== 0) {
				updateSetting({
					settingName: 'locale',
					settingValue: supportedLocales[0],
				});
			}
		}
	}, [ipQuery.data, currencyQuery.data, localeQuery.data, updateSetting]);

	if (currencyQuery.isLoading) {
		return <LoadingComponent loadingMessage='Loading currency...' />;
	}

	if (currencyQuery.isError) {
		return <ErrorComponent errorMessage='Error while loading currency' />;
	}

	if (localeQuery.isLoading) {
		return <LoadingComponent loadingMessage='Loading locale...' />;
	}

	if (localeQuery.isError) {
		return <ErrorComponent errorMessage='Error while loading locale' />;
	}

	if (ipQuery.isLoading) {
		return <LoadingComponent loadingMessage='Loading currency and locale...' />;
	}

	if (ipQuery.isError) {
		return (
			<ErrorComponent errorMessage='Error while loading currency and locale' />
		);
	}

	const settings = [
		{
			name: 'currency',
			title: 'Currency',
			value: currencyQuery.data || 'USD',
			options: Intl.supportedValuesOf('currency'),
		},
		{
			name: 'locale',
			title: 'Language',
			value: localeQuery.data || 'en-US',
			options: LOCALE_OPTIONS,
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
