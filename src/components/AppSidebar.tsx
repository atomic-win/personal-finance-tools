import { DollarSignIcon } from 'lucide-react';

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
} from '@/components/ui/sidebar';
import AccountMenu from '@/components/AccountMenu';

const data = [
	{
		title: 'Investments',
		url: '#',
		auth: true,
		items: [
			{ title: 'Portfolio', url: '/investments/portfolio' },
			{ title: 'Assets', url: '/investments/assets' },
			{ title: 'Portfolio Trends', url: '/investments/portfolio-trends' },
		],
	},
	{
		title: 'Calculators',
		url: '#',
		auth: false,
		items: [
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
		title: 'Mutual Funds Analysis',
		url: '#',
		auth: false,
		items: [
			{
				title: 'Rolling Returns',
				url: '/analyzers/mutualfunds',
			},
		],
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const showAuthenticatedComponents = process.env.NODE_ENV === 'development';

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size='lg' asChild>
							<a href='#'>
								<div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
									<DollarSignIcon className='size-4' />
								</div>
								<div className='flex flex-col gap-0.5 leading-none'>
									<span className='font-semibold'>Personal Finance Tools</span>
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						{data
							.filter((item) => showAuthenticatedComponents || !item.auth)
							.map((item) => (
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
			</SidebarContent>
			{showAuthenticatedComponents && (
				<SidebarFooter>
					<SidebarMenu>
						<SidebarMenuItem>
							<AccountMenu />
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
			)}
			<SidebarRail />
		</Sidebar>
	);
}
