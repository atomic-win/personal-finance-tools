'use client';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import '@/app/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { GoogleOAuthProvider } from '@react-oauth/google';
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
				<QueryClientProvider client={queryClient}>
					<GoogleOAuthProvider clientId='73478229232-4shu2tigpasb0drjlsn39g4isdm6kuv3.apps.googleusercontent.com'>
						<SidebarProvider>
							<AppSidebar />
							<SidebarInset>
								<main className='container my-6 mx-auto'>
									<SidebarTrigger />
									{children}
									<ReactQueryDevtools />
								</main>
							</SidebarInset>
						</SidebarProvider>
					</GoogleOAuthProvider>
				</QueryClientProvider>
			</body>
		</html>
	);
}
