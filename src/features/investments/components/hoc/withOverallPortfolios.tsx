import {
	OverallPortfolio,
	Portfolio,
	Instrument,
	Asset,
	PortfolioType,
	Transaction,
} from '@/features/investments/lib/types';
import { withValuations } from '@/features/investments/components/hoc/withValuations';

export function withOverallPortfolios<
	T extends { portfolios: OverallPortfolio[] }
>(Component: React.ComponentType<T>) {
	return function WithOverallPortfolios(
		props: Omit<T, 'portfolios'> & {
			currency: string;
			assetIds: string[];
			assets: Asset[];
			instruments: Instrument[];
			transactions: Transaction[];
			latest: boolean;
		}
	) {
		const WithLoadedValuationsComponent = withValuations(Component);

		return (
			<WithLoadedValuationsComponent
				{...(props as unknown as T)}
				currency={props.currency}
				assetIds={props.assetIds}
				assets={props.assets}
				instruments={props.instruments}
				transactions={props.transactions}
				idSelector={() => 'overall'}
				portfolioFn={calculateOverallPortfolio}
				latest={props.latest}
			/>
		);
	};
}

function calculateOverallPortfolio(
	assets: Asset[],
	instruments: Instrument[],
	portfolio: Portfolio
): OverallPortfolio {
	return {
		...portfolio,
		type: PortfolioType.Overall,
	};
}
