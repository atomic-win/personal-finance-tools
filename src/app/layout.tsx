'use client';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';
import { DollarSignIcon } from 'lucide-react';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-sans',
});

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 60 * 60 * 15, // 24 hours
			staleTime: 1000 * 60 * 10, // 1 hour
		},
	},
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={cn(
					'min-h-screen, bg-background font-sans antialiased',
					inter.variable
				)}>
				<header className='flex py-2 border-b bg-card gap-2'>
					<Link href='/' className='flex items-center font-semibold px-8'>
						<DollarSignIcon className='size-6' />
						<span>Personal Finance Tools</span>
					</Link>
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuTrigger>Calculator</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className='gap-2'>
										<ListItem title='SIP Calculator' href='/calculator/sip' />
										<ListItem title='SWP Calculator' href='/calculator/swp' />
										<ListItem
											title='SIP-SWP Calculator'
											href='/calculator/sip-swp'
										/>
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuTrigger>Analysis</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className='gap-2'>
										<ListItem
											title='Mutual Funds'
											href='/analysis/mutualfunds'
										/>
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</header>
				<main className='container my-6 mx-auto'>
					<QueryClientProvider client={queryClient}>
						{children}
						<ReactQueryDevtools />
					</QueryClientProvider>
				</main>
			</body>
		</html>
	);
}

function ListItem({ title, href }: { title: string; href: string }) {
	return (
		<li>
			<Link
				href={href}
				className={
					'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
				}>
				<div className='font-medium whitespace-nowrap'>{title}</div>
			</Link>
		</li>
	);
}
