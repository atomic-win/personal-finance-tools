import { TanStackDevtools } from '@tanstack/react-devtools';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import type { ReactNode } from 'react';
import Providers from '@/components/providers';
import '@fontsource/inter/latin.css';
import '@/globals.css';

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ title: 'Personal Finance Tools' },
		],
		links: [{ rel: 'icon', href: '/favicon.ico' }],
	}),
	component: RootComponent,
});

function RootComponent() {
	return (
		<RootDocument>
			<Providers>
				<Outlet />
				<TanStackDevtools
					config={{ position: 'bottom-right' }}
					plugins={[
						{
							id: 'react-query',
							name: 'Tanstack Query',
							render: <ReactQueryDevtoolsPanel />,
						},
						{
							id: 'react-router',
							name: 'Tanstack Router',
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
			</Providers>
		</RootDocument>
	);
}

function RootDocument({ children }: { children: ReactNode }) {
	return (
		<html lang='en'>
			<head>
				<HeadContent />
			</head>
			<body className='min-h-screen bg-background font-sans antialiased'>
				{children}
				<Scripts />
			</body>
		</html>
	);
}
