import { DollarSignIcon, Send } from 'lucide-react';

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
} from '@/components/ui/sidebar';
import SettingsSidebarGroup from '@/components/SettingsSidebarGroup';
import Link from 'next/link';

const data = [
	{
		title: 'Calculators',
		url: '#',
		items: [
			{
				title: 'FD Interest Calculator',
				url: '/calculators/fixed-deposit',
			},
			{
				title: 'RD Interest Calculator',
				url: '/calculators/recurring-deposit',
			},
			{
				title: 'SIP Calculator',
				url: '/calculators/sip',
			},
			{
				title: 'SWP Calculator',
				url: '/calculators/swp',
			},
			{
				title: 'SIP + SWP Calculator',
				url: '/calculators/sip-swp',
			},
		],
	},
	{
		title: 'Indian Mutual Funds Analysis',
		url: '#',
		items: [
			{
				title: 'Rolling Returns',
				url: '/indian-mutual-funds-analysis/rolling-returns',
			},
		],
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size='lg' asChild>
							<Link href='/'>
								<div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
									<DollarSignIcon className='size-4' />
								</div>
								<div className='flex flex-col gap-0.5 leading-none'>
									<span className='font-semibold'>Personal Finance Tools</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						{data.map((item) => (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton className='font-medium'>
									{item.title}
								</SidebarMenuButton>
								<SidebarMenuSub>
									{item.items.map((item) => (
										<SidebarMenuSubItem key={item.title}>
											<SidebarMenuSubButton asChild>
												<a href={item.url}>{item.title}</a>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									))}
								</SidebarMenuSub>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
				<SettingsSidebarGroup />
				<SidebarGroup className='mt-8'>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild size='sm'>
									<a target='_blank' href='https://forms.gle/hkvX3nzQcsBVn4xp7'>
										<Send />
										<span>Feedback</span>
									</a>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
