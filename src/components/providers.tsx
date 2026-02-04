'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppSidebar } from '@/components/app-sidebar';
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
			<SidebarProvider>
				<AppSidebar />
				<main className='flex flex-1 flex-col gap-4 pt-0 px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32'>
					{children}
					<ReactQueryDevtools />
				</main>
			</SidebarProvider>
		</QueryClientProvider>
	);
}
