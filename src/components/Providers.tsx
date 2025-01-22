'use client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { persistQueryClient } from '@tanstack/react-query-persist-client';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 60 * 60 * 24, // 24 hours
			staleTime: 1000 * 60 * 60, // 1 hour
			refetchOnWindowFocus: true,
		},
	},
});

const ISSERVER = typeof window === 'undefined';

if (!ISSERVER) {
	const localStoragePersister = createSyncStoragePersister({
		storage: localStorage,
	});

	persistQueryClient({
		queryClient,
		persister: localStoragePersister,
	});
}

export default function Providers({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<QueryClientProvider client={queryClient}>
			<GoogleOAuthProvider clientId='73478229232-4shu2tigpasb0drjlsn39g4isdm6kuv3.apps.googleusercontent.com'>
				<SidebarProvider>
					<AppSidebar />
					<main className='container'>
						<div className='flex flex-col min-h-screen'>
							<div className='flex-grow'>{children}</div>
							<footer className='text-center w-full p-4'>
								<a
									target='_blank'
									href='https://forms.gle/hkvX3nzQcsBVn4xp7'
									className='underline'>
									Feedback
								</a>
							</footer>
						</div>
						<ReactQueryDevtools />
					</main>
				</SidebarProvider>
			</GoogleOAuthProvider>
		</QueryClientProvider>
	);
}
