'use client';
import {
	useMutualFundListQuery,
	useMutualFundQueries,
} from '@/components/hooks/mutualfunds';
import AnalysisTable from './analysis-table';
import MutualFundsInputCard from './mutualfunds-card';
import SIPInputCard from './sip-card';
import { useSearchParams } from 'next/navigation';
import { PresetTimeDurations } from '@/lib/types';

export default function Page() {
	const searchParams = useSearchParams();
	const { data: mutualFundList } = useMutualFundListQuery();

	const lumpsumAmount = Number(searchParams.get('lumpsumAmount') || 0);

	const monthlyInvestment = Number(
		searchParams.get('monthlyInvestment') || 500
	);

	const annualStepUpPercent = Number(
		searchParams.get('annualStepUpPercent') || 10
	);

	const investmentDuration =
		(searchParams.get(
			'investmentDuration'
		) as unknown as PresetTimeDurations) || PresetTimeDurations.OneYear;

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
				<AnalysisTable
					mutualfunds={addedMutualfunds}
					lumpsumAmount={lumpsumAmount}
					monthlyInvestment={monthlyInvestment}
					annualStepUpPercent={annualStepUpPercent}
					investmentDuration={investmentDuration}
				/>
				<SIPInputCard
					lumpsumAmount={lumpsumAmount}
					monthlyInvestment={monthlyInvestment}
					annualStepUpPercent={annualStepUpPercent}
					investmentDuration={investmentDuration}
				/>
				<MutualFundsInputCard
					mutualFundList={mutualFundList}
					addedMutualFunds={addedMutualfunds}
				/>
			</div>
		</div>
	);
}
