import {
	InstrumentPortfolio,
	Instrument,
	Portfolio,
	Asset,
	PortfolioType,
	Transaction,
} from '@/features/investments/lib/types';
import { findInstrumentById } from '@/features/investments/lib/utils';
import { withValuations } from '@/features/investments/components/hoc/withValuations';

export function withInstrumentPortfolios<
	T extends { portfolios: InstrumentPortfolio[] }
>(Component: React.ComponentType<T>) {
	return function WithInstrumentPortfolios(
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
				idSelector={(_asset, instrument) => instrument.id}
				portfolioFn={calculateInstrumentPortfolio}
				latest={props.latest}
			/>
		);
	};
}

function calculateInstrumentPortfolio(
	assets: Asset[],
	instruments: Instrument[],
	portfolio: Portfolio
): InstrumentPortfolio {
	const instrument = findInstrumentById(instruments, portfolio.id)!;

	return {
		...portfolio,
		type: PortfolioType.PerInvestmentInstrument,
		instrumentName: instrument.name,
		instrumentType: instrument.type,
	};
}
