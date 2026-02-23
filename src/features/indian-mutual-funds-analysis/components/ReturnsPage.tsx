'use client';
import ReturnsChartCard from '@/features/indian-mutual-funds-analysis/components/ReturnsChartCard';
import RollingReturnsTableCard from '@/features/indian-mutual-funds-analysis/components/RollingReturnsTableCard';
import SelectMutualFundsCard from '@/features/indian-mutual-funds-analysis/components/SelectMutualFundsCard';
import { useSearchParams } from 'next/navigation';
import {
	Frequency,
	PresetTimeDurations,
	ReturnRequest,
	ReturnType,
	RollingReturnType,
} from '@/features/indian-mutual-funds-analysis/lib/types';
import SidebarTriggerWithBreadcrumb from '@/components/sidebar-trigger-with-breadcrumb';
import { Suspense } from 'react';
import ReturnsForm from '@/features/indian-mutual-funds-analysis/components/ReturnsForm';

export default function ReturnsPage({
	title,
	href,
	description,
	returnType,
}: {
	title: string;
	href: string;
	description: string;
	returnType: ReturnType;
}) {
	const htmlTitle = `Indian Mutual Funds ${title} Returns`;

	return (
		<>
			<title>{htmlTitle}</title>
			<meta
				name='keywords'
				content='Mutual Funds, Rolling Returns, CAGR, Investment Analysis, Financial Planning'
			/>
			<SidebarTriggerWithBreadcrumb
				breadcrumbs={[
					{
						title: 'Indian Mutual Funds Analysis',
						href: '',
						disabled: true,
					},
					{ title: `${title} Returns`, href, disabled: true },
				]}
			/>
			<div className='px-4 space-y-2'>
				<h1 className='text-2xl font-bold'>
					Indian Mutual Funds Analysis
				</h1>
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

	const rollingWindow = searchParams.get('rollingWindow')
		? (searchParams.get('rollingWindow') as PresetTimeDurations)
		: PresetTimeDurations.TwoYears;

	const rollingReturnType = searchParams.get('rollingReturnType')
		? (searchParams.get('rollingReturnType') as RollingReturnType)
		: RollingReturnType.Avg;

	const returnsRequest = {
		investmentDuration,
		returnType,
		frequency,
		stepUpFrequency,
		stepUpRatio,
		rollingWindow,
		rollingReturnType,
	} as ReturnRequest;

	return (
		<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
			<div className='order-2 md:order-1 md:col-span-2 space-y-4'>
				<ReturnsForm returnRequest={returnsRequest} />
				<RollingReturnsTableCard returnRequest={returnsRequest} />
				<ReturnsChartCard returnRequest={returnsRequest} />
			</div>
			<div className='order-1 md:order-2'>
				<SelectMutualFundsCard />
			</div>
		</div>
	);
}
