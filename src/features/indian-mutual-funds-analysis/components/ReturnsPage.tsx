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
import LoadingComponent from '@/components/LoadingComponent';
import ErrorComponent from '@/components/ErrorComponent';

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
		switch (returnType) {
			case 'simple':
				return {
					title: 'Rolling Returns',
					href: '/indian-mutual-funds-analysis/rolling-returns',
				};
			case 'sip':
				return {
					title: 'SIP Returns',
					href: '/indian-mutual-funds-analysis/sip',
				};
			case 'swp':
				return {
					title: 'SWP Returns',
					href: '/indian-mutual-funds-analysis/swp',
				};
			default:
				throw new Error('Invalid return type');
		}
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
	const mutualFundListQuery = useMutualFundListQuery();

	const mutualFundQueries = useMutualFundQueries(
		searchParams.getAll('mfSchemeCode').map(Number)
	);

	if (mutualFundListQuery.isFetching) {
		return <LoadingComponent loadingMessage='Fetching mutual fund list...' />;
	}

	if (mutualFundListQuery.isError) {
		return <ErrorComponent errorMessage='Failed to fetch mutual fund list' />;
	}

	if (mutualFundQueries.some((mfq) => mfq.isFetching)) {
		return <LoadingComponent loadingMessage='Fetching mutual fund data...' />;
	}

	if (mutualFundQueries.some((mfq) => mfq.isError)) {
		return <ErrorComponent errorMessage='Failed to fetch mutual fund data' />;
	}

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

	const addedMutualfunds = (mutualFundQueries || [])
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
		<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
			<div className='order-2 md:order-1 md:col-span-2 space-y-4'>
				<ReturnsForm {...returnsRequest} />
				<ReturnsChartCard mutualfunds={addedMutualfunds} {...returnsRequest} />
				<RollingReturnsTableCard
					mutualfunds={addedMutualfunds}
					{...returnsRequest}
				/>
			</div>
			<div className='order-1 md:order-2'>
				<SelectMutualFundsCard
					mutualFundList={mutualFundListQuery.data!}
					addedMutualFunds={addedMutualfunds}
				/>
			</div>
		</div>
	);
}
