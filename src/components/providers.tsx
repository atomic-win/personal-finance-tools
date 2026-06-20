import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { useEffect, useRef } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 60 * 60 * 24, // 24 hours
			staleTime: 1000 * 60 * 60, // 1 hour
			refetchOnWindowFocus: true,
		},
	},
});

export default function Providers({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const persisted = useRef(false);

	useEffect(() => {
		if (persisted.current) return;
		persisted.current = true;

		const localStoragePersister = createAsyncStoragePersister({
			storage: window.localStorage,
		});

		persistQueryClient({
			queryClient,
			persister: localStoragePersister,
		});
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<SidebarProvider>
				<AppSidebar />
				<main className='flex flex-1 flex-col gap-4 pt-0 px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32'>
					{children}
				</main>
			</SidebarProvider>
		</QueryClientProvider>
	);
}
