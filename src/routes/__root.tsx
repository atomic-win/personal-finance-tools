import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
} from '@tanstack/react-router';
import type { ReactNode } from 'react';
import '@fontsource/inter/latin.css';
import '@/globals.css';
import Providers from '@/components/providers';

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
		],
		links: [
			{
				rel: 'icon',
				href: '/favicon.ico',
			},
		],
	}),
	component: RootComponent,
});

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	);
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang='en'>
			<head>
				<HeadContent />
			</head>
			<body className='min-h-screen bg-background font-sans antialiased'>
				<Providers>{children}</Providers>
				<Scripts />
			</body>
		</html>
	);
}
