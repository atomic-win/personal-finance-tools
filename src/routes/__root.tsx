import { TanStackDevtools } from '@tanstack/react-devtools';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import Providers from '@/components/providers';

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	return (
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
	);
}
