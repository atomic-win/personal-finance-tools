'use client';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

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
				<SidebarProvider>
					<AppSidebar />
					<SidebarInset>
						<main className='container my-6 mx-auto'>
							<QueryClientProvider client={queryClient}>
								<SidebarTrigger />
								{children}
								<ReactQueryDevtools />
							</QueryClientProvider>
						</main>
					</SidebarInset>
				</SidebarProvider>
			</body>
		</html>
	);
}
