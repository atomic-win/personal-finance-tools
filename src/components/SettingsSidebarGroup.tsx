import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	useSidebar,
} from '@/components/ui/sidebar';
import useCurrencyQuery from '@/hooks/useCurrencyQuery';
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

export default function SettingsSidebarGroup() {
	const { isMobile } = useSidebar();
	const { mutate: updateSetting } = useUpdateSettingMutation();
	const { data: currency, isLoading } = useCurrencyQuery();

	if (isLoading || !currency) {
		return null;
	}

	const settings = [
		{
			name: 'currency',
			title: 'Currency',
			value: currency,
			options: Intl.supportedValuesOf('currency'),
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
							updateSetting({ settingName: setting.name, setttingValue: x })
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
