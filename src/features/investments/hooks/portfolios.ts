import { usePrimalApiClient } from '@/hooks/usePrimalApiClient';
import { useQuery } from '@tanstack/react-query';
import hash from 'object-hash';
import { Currency } from '@/lib/types';
import { Portfolio, PortfolioType } from '@/features/investments/lib/types';

export default function usePortfoliosQuery(
	currency: Currency | undefined,
	assetIds: string[] | undefined,
	portfolioType: PortfolioType,
	latest: boolean
) {
	const primalApiClient = usePrimalApiClient();

	const hashValue = hash(assetIds || [], {
		unorderedArrays: true,
	});

	return useQuery({
		queryKey: [
			'investments',
			'portfolio',
			{
				currency,
				assetIdsHash: hashValue,
			},
		],
		queryFn: async () => {
			const response = await primalApiClient.post('/investments/portfolio', {
				currency,
				assetIds,
			});
			return (response.data as Portfolio[]).sort((a, b) =>
				a.date.localeCompare(b.date)
			);
		},
		enabled: !!currency && !!assetIds?.length && assetIds.length > 0,
		select: (data) => filterPortfolios(data, portfolioType, latest),
	});
}

function filterPortfolios(
	portfolios: Portfolio[],
	portfolioType: PortfolioType,
	latest: boolean
) {
	portfolios = portfolios.filter(
		(portfolio) => portfolio.type === portfolioType
	);

	if (latest) {
		const latestDate = portfolios
			.map((x) => x.date)
			.reduce((max, item) => (item > max ? item : max));

		portfolios = portfolios.filter(
			(portfolio) => portfolio.date === latestDate
		);
	}

	return portfolios;
}
