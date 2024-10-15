import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';
import { DollarSignIcon } from 'lucide-react';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-sans',
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
					<div className='flex items-center font-semibold px-8'>
						<DollarSignIcon className='size-6' />
						<span>Personal Finance Tools</span>
					</div>
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuTrigger>Calculator</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className='gap-2'>
										<ListItem title='SIP Calculator' />
										<ListItem title='SWP Calculator' />
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</header>
				<main className='container my-6 mx-auto'>{children}</main>
			</body>
		</html>
	);
}

function ListItem({ title }: { title: string }) {
	return (
		<li>
			<NavigationMenuLink href='/calculator/compound-interest'>
				<a
					className={
						'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
					}>
					<div className='font-medium whitespace-nowrap'>{title}</div>
				</a>
			</NavigationMenuLink>
		</li>
	);
}
