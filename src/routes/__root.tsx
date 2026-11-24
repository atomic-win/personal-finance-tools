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
import { GoogleAnalytics } from 'tanstack-router-ga4';
import Providers from '@/components/providers';
import '@fontsource/inter/latin.css';
import '@/globals.css';

const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

if (gaMeasurementId && !/^G-[A-Z0-9]+$/.test(gaMeasurementId)) {
	throw new Error(
		'VITE_GA_MEASUREMENT_ID must be a GA4 measurement ID (G-...).'
	);
}

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
				{import.meta.env.PROD && gaMeasurementId && (
					<GoogleAnalytics measurementId={gaMeasurementId} />
				)}
				{children}
				<Scripts />
			</body>
		</html>
	);
}
