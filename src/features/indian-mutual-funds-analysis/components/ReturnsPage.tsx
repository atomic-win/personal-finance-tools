'use client';
import {
	useMutualFundListQuery,
	useMutualFundQueries,
} from '@/features/indian-mutual-funds-analysis/hooks/mutualfunds';
import ReturnsChartCard from '@/features/indian-mutual-funds-analysis/components/ReturnsChartCard';
import RollingReturnsTableCard from '@/features/indian-mutual-funds-analysis/components/RollingReturnsTableCard';
import SelectMutualFundsCard from '@/features/indian-mutual-funds-analysis/components/SelectMutualFundsCard';
import { useSearchParams } from 'next/navigation';
import {
	Frequency,
	PresetTimeDurations,
	ReturnRequest,
	ReturnType,
} from '@/features/indian-mutual-funds-analysis/lib/types';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import { Suspense } from 'react';
import ReturnsForm from '@/features/indian-mutual-funds-analysis/components/ReturnsForm';

export default function ReturnsPage({
	title,
	description,
	returnType,
}: {
	title: string;
	description: string;
	returnType: ReturnType;
}) {
	const htmlTitle = `Indian Mutual Funds ${title} Returns`;

	const breadcrumb = (returnType: ReturnType) => {
		if (returnType === 'simple') {
			return {
				title: 'Rolling Returns',
				href: '/indian-mutual-funds-analysis/rolling-returns',
			};
		}

		if (returnType === 'sip') {
			return {
				title: 'SIP Returns',
				href: '/indian-mutual-funds-analysis/sip',
			};
		}

		if (returnType === 'swp') {
			return {
				title: 'SWP Returns',
				href: '/indian-mutual-funds-analysis/swp',
			};
		}

		throw new Error('Invalid return type');
	};

	return (
		<>
			<title>{htmlTitle}</title>
			<meta
				name='keywords'
				content='Mutual Funds, Rolling Returns, CAGR, Investment Analysis, Financial Planning'
			/>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{ title: 'Indian Mutual Funds Analysis', href: '', disabled: true },
					breadcrumb(returnType),
				]}
			/>
			<div className='px-4 space-y-2'>
				<h1 className='text-2xl font-bold'>Indian Mutual Funds Analysis</h1>
				<h2 className='text-lg font-semibold'>{title} Returns</h2>
				<p>{description}</p>
				<Suspense>
					<ReturnsPageContainer returnType={returnType} />
				</Suspense>
			</div>
		</>
	);
}

function ReturnsPageContainer({ returnType }: { returnType: ReturnType }) {
	const searchParams = useSearchParams();
	const { data: mutualFundList } = useMutualFundListQuery();

	const addedMutualFundResults = useMutualFundQueries(
		searchParams.getAll('mfSchemeCode').map(Number)
	);

	const frequency = searchParams.get('frequency')
		? (searchParams.get('frequency') as Frequency)
		: Frequency.Monthly;

	const stepUpFrequency = searchParams.get('stepUpFrequency')
		? (searchParams.get('stepUpFrequency') as Frequency)
		: Frequency.Yearly;

	const stepUpRatio = searchParams.get('stepUpRatio')
		? Number(searchParams.get('stepUpRatio'))
		: 0.1;

	const investmentDuration = searchParams.get('investmentDuration')
		? (searchParams.get('investmentDuration') as PresetTimeDurations)
		: PresetTimeDurations.OneYear;

	if (!mutualFundList || !mutualFundList.length) {
		return null;
	}

	const addedMutualfunds = (addedMutualFundResults || [])
		.filter((r) => r.isSuccess)
		.map((r) => r.data!)
		.filter((mf) => mf !== null && !!mf.schemeName);

	const returnsRequest = {
		investmentDuration,
		returnType,
		frequency,
		stepUpFrequency,
		stepUpRatio,
	} as ReturnRequest;

	return (
		<div className='grid grid-cols-3 gap-4'>
			<div className='col-span-2 space-y-4'>
				<ReturnsForm {...returnsRequest} />
				<ReturnsChartCard mutualfunds={addedMutualfunds} {...returnsRequest} />
				<RollingReturnsTableCard
					mutualfunds={addedMutualfunds}
					{...returnsRequest}
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
