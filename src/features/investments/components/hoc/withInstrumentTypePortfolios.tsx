import {
	InstrumentTypePortfolio,
	Portfolio,
	Instrument,
	Asset,
	PortfolioType,
	Transaction,
} from '@/features/investments/lib/types';
import { withValuations } from '@/features/investments/components/hoc/withValuations';

export function withInstrumentTypePortfolios<
	T extends { portfolios: InstrumentTypePortfolio[] }
>(Component: React.ComponentType<T>) {
	return function WithInstrumentTypePortfolios(
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
				idSelector={(_asset, instrument) => instrument.type}
				portfolioFn={calculateInstrumentTypePortfolio}
				latest={props.latest}
			/>
		);
	};
}

function calculateInstrumentTypePortfolio(
	assets: Asset[],
	instruments: Instrument[],
	portfolio: Portfolio
): InstrumentTypePortfolio {
	return {
		...portfolio,
		type: PortfolioType.PerInvestmentInstrumentType,
	};
}
