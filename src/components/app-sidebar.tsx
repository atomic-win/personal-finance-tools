import { DollarSignIcon, Send } from 'lucide-react';
import Link from 'next/link';
import SettingsSidebarGroup from '@/components/settings-sidebar-group';
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
				title: 'NAV History',
				url: '/indian-mutual-funds-analysis/nav',
			},
			{
				title: 'CAGR Returns',
				url: '/indian-mutual-funds-analysis/cagr',
			},
			{
				title: 'SIP Returns',
				url: '/indian-mutual-funds-analysis/sip',
			},
			{
				title: 'SWP Returns',
				url: '/indian-mutual-funds-analysis/swp',
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
						<SidebarMenuButton size='lg'>
							<Link href='/' className='flex items-center gap-3'>
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
											<SidebarMenuSubButton href={item.url}>
												{item.title}
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									))}
								</SidebarMenuSub>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
				<SidebarGroup className='mt-auto'>
					<SettingsSidebarGroup />
				</SidebarGroup>
				<SidebarGroup className='mt-8'>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton size='sm' className='w-full justify-center'>
									<a
										target='_blank'
										href='https://forms.gle/hkvX3nzQcsBVn4xp7'
										className='flex items-center gap-2'
										rel='noopener'
									>
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
