'use client';
import {
	useMutualFundListQuery,
	useMutualFundQueries,
} from '@/components/hooks/mutualfunds';
import RollingReturnsTable from './rolling-returns-table';
import MutualFundsForm from './mutualfunds-form';
import { useSearchParams } from 'next/navigation';
import ReturnsChartCard from './returns-chart';

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
			<h1 className='text-2xl font-bold mb-4'>Mutual Funds Analysis</h1>
			<div className='grid grid-cols-3 gap-4'>
				<div className='col-span-2'>
					<ReturnsChartCard mutualfunds={addedMutualfunds} />
					<RollingReturnsTable mutualfunds={addedMutualfunds} />
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
