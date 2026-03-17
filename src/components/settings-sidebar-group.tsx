'use client';
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
} from '@/components/ui/sidebar';
import { useCurrencyQuery } from '@/hooks/useCurrencyQuery';
import useUpdateSettingMutation from '@/hooks/useUpdateSettingMutation';
import { useIpQuery } from '@/hooks/useIpQuery';
import { useLocaleQuery } from '@/hooks/useLocaleQuery';
import { cn, LOCALE_OPTIONS } from '@/lib/utils';
import LoadingComponent from '@/components/loading-component';
import ErrorComponent from '@/components/error-component';
import { useEffect } from 'react';
import _ from 'lodash';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { buttonVariants } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

export default function SettingsSidebarGroup() {
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
					<DropdownMenu key={setting.name}>
						<DropdownMenuTrigger
							className={cn(
								'w-full rounded-lg px-3 py-2 flex justify-between',
								buttonVariants({
									variant: 'outline',
								})
							)}
							aria-label='Select a value'
						>
							<span>
								{setting.title} - {setting.value}
							</span>
							<ChevronRight className='h-4 w-4 opacity-50' />
						</DropdownMenuTrigger>
						<DropdownMenuContent side='right' align='center'>
							{setting.options.map((option) => (
								<DropdownMenuCheckboxItem
									key={option}
									checked={option === setting.value}
									onCheckedChange={() =>
										updateSetting({
											settingName: setting.name,
											settingValue: option,
										})
									}
								>
									{option}
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
