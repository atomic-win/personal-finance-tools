'use client';
import {
	useMutualFundListQuery,
	useMutualFundQueries,
} from '@/features/indian-mutual-funds-analysis/hooks/mutualfunds';
import ReturnsChartCard from '@/features/indian-mutual-funds-analysis/components/ReturnsChartCard';
import RollingReturnsTableCard from '@/features/indian-mutual-funds-analysis/components/RollingReturnsTableCard';
import SelectMutualFundsCard from '@/features/indian-mutual-funds-analysis/components/SelectMutualFundsCard';
import { useSearchParams } from 'next/navigation';
import { ReturnType } from '@/features/indian-mutual-funds-analysis/lib/types';

export default function ReturnsPageContainer({
	returnType,
}: {
	returnType: ReturnType;
}) {
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
				<ReturnsChartCard
					mutualfunds={addedMutualfunds}
					returnType={returnType}
				/>
				<RollingReturnsTableCard
					mutualfunds={addedMutualfunds}
					returnType={returnType}
				/>
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
