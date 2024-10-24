'use client';
import ErrorComponent from '@/components/ErrorComponent';
import LoadingComponent from '@/components/LoadingComponent';
import { Asset } from '@/features/investments/lib/types';
import { useAllAssetsQuery } from '@/features/investments/hooks/assets';

export default function withAssets<T extends { assets: Asset[] }>(
	Component: React.ComponentType<T>
) {
	return function WithAssets(props: Omit<T, 'assets'>) {
		const { data: assets, isFetching, error } = useAllAssetsQuery();

		if (isFetching) {
			return <LoadingComponent loadingMessage='Fetching assets' />;
		}

		if (error || !assets) {
			return <ErrorComponent errorMessage='Failed while fetching assets' />;
		}

		return <Component {...(props as T)} assets={assets!} />;
	};
}
