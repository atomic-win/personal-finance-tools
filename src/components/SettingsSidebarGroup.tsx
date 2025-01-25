import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, MoreHorizontal } from 'lucide-react';
import useCurrencyQuery from '@/hooks/useCurrencyQuery';
import { Currency } from '@/lib/types';
import useUpdateSettingMutation from '@/hooks/useUpdateSettingMutation';

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
			options: Object.values(Currency).filter((x) => x !== Currency.Unknown),
		},
	];

	return (
		<SidebarGroup className='mt-auto'>
			<SidebarGroupLabel>Settings</SidebarGroupLabel>
			<SidebarMenu>
				{settings.map((setting) => (
					<DropdownMenu key={setting.title}>
						<SidebarMenuItem>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
									{setting.title} - {setting.value}{' '}
									<MoreHorizontal className='ml-auto' />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							{setting.options.length ? (
								<DropdownMenuContent
									side={isMobile ? 'bottom' : 'right'}
									align={isMobile ? 'end' : 'start'}
									className='min-w-56 rounded-lg'>
									{setting.options.map((option) => (
										<DropdownMenuItem
											asChild
											key={option}
											onClick={() =>
												updateSetting({
													settingName: setting.name,
													setttingValue: option,
												})
											}>
											<div className='flex items-center gap-2'>
												{option === setting.value ? (
													<Check className='size-4' />
												) : (
													<span className='size-4' />
												)}
												<text>{option}</text>
											</div>
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							) : null}
						</SidebarMenuItem>
					</DropdownMenu>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
