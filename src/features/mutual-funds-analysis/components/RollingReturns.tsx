'use client';
import {
	useMutualFundListQuery,
	useMutualFundQueries,
} from '@/features/mutual-funds-analysis/hooks/mutualfunds';
import MutualFundsReturnsChart from '@/features/mutual-funds-analysis/components/ReturnsChartCard';
import MutualFundsRollingReturnsTable from '@/features/mutual-funds-analysis/components/RollingReturnsTableCard';
import SelectMutualFundsCard from '@/features/mutual-funds-analysis/components/SelectMutualFundsCard';
import { useSearchParams } from 'next/navigation';

export default function RollingReturns() {
	const searchParams = useSearchParams();
	const { data: mutualFundList } = useMutualFundListQuery();

	const addedMutualFundResults = useMutualFundQueries(
		searchParams.getAll('mfSchemeCode').map(Number)
	);

	if (!mutualFundList || !mutualFundList.length) {
		return null;
	}

	const addedMutualfunds = (addedMutualFundResults || [])
		.filter((r) => r.isSuccess)
		.map((r) => r.data!)
		.filter((mf) => mf !== null && !!mf.schemeName);

	return (
		<div className='grid grid-cols-3 gap-4'>
			<div className='col-span-2 space-y-4'>
				<MutualFundsReturnsChart mutualfunds={addedMutualfunds} />
				<MutualFundsRollingReturnsTable mutualfunds={addedMutualfunds} />
			</div>
			<div>
				<SelectMutualFundsCard
					mutualFundList={mutualFundList}
					addedMutualFunds={addedMutualfunds}
				/>
			</div>
		</div>
	);
}
