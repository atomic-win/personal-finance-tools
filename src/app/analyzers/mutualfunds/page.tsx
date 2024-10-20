'use client';
import {
	useMutualFundListQuery,
	useMutualFundQueries,
} from '@/features/analyzers/hooks/mutualfunds';
import MutualFundsReturnsChart from '@/features/analyzers/components/MutualFundsReturnsChart';
import MutualFundsRollingReturnsTable from '@/features/analyzers/components/MutualFundsRollingReturnsTable';
import MutualFundsForm from '@/features/analyzers/components/MutualFundsForm';
import { useSearchParams } from 'next/navigation';

export default function Page() {
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
		<div className='container mx-auto p-2'>
			<h1 className='text-2xl font-bold mb-4'>Mutual Funds Analyzer</h1>
			<div className='grid grid-cols-3 gap-4'>
				<div className='col-span-2'>
					<MutualFundsReturnsChart mutualfunds={addedMutualfunds} />
					<MutualFundsRollingReturnsTable mutualfunds={addedMutualfunds} />
				</div>
				<div>
					<MutualFundsForm
						mutualFundList={mutualFundList}
						addedMutualFunds={addedMutualfunds}
					/>
				</div>
			</div>
		</div>
	);
}
