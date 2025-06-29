'use client';
import ReturnsChartCard from '@/features/indian-mutual-funds-analysis/components/ReturnsChartCard';
import RollingReturnsTableCard from '@/features/indian-mutual-funds-analysis/components/RollingReturnsTableCard';
import SelectInstrumentsCard from '@/features/indian-mutual-funds-analysis/components/SelectInstrumentsCard';
import { useSearchParams } from 'next/navigation';
import {
	Frequency,
	InstrumentType,
	PresetTimeDurations,
	ReturnRequest,
	ReturnType,
	RollingReturnType,
} from '@/features/indian-mutual-funds-analysis/lib/types';
import SidebarTriggerWithBreadcrumb from '@/components/SidebarTriggerWithBreadcrumb';
import { Suspense } from 'react';
import ReturnsForm from '@/features/indian-mutual-funds-analysis/components/ReturnsForm';
import LoadingComponent from '@/components/LoadingComponent';
import ErrorComponent from '@/components/ErrorComponent';
import { useIsMobile } from '@/hooks/use-mobile';
import {
	useInstrumentListQuery,
	useInstrumentQueries,
} from '@/features/indian-mutual-funds-analysis/hooks/instruments';
import { instrumentTypeText } from '../lib/utils';

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
					{ title: 'Indian Mutual Funds Analysis', href: '', disabled: true },
					{ title: `${title} Returns`, href, disabled: true },
				]}
			/>
			<div className='px-4 space-y-2'>
				<h1 className='text-2xl font-bold'>Indian Mutual Funds Analysis</h1>
				<h2 className='text-lg font-semibold'>{title} Returns</h2>
				<p>{description}</p>
				<Suspense>
					<ReturnsPageContainer
						instrumentType={InstrumentType.MutualFund}
						returnType={returnType}
					/>
				</Suspense>
			</div>
		</>
	);
}

function ReturnsPageContainer({
	instrumentType,
	returnType,
}: {
	instrumentType: InstrumentType;
	returnType: ReturnType;
}) {
	const isMobile = useIsMobile();
	const searchParams = useSearchParams();
	const instrumentListQuery = useInstrumentListQuery(instrumentType);

	const instrumentQueries = useInstrumentQueries(
		instrumentType,
		searchParams.getAll('symbol')
	);

	if (instrumentListQuery.isFetching) {
		return (
			<LoadingComponent
				loadingMessage={`Fetching ${instrumentTypeText(
					instrumentType
				)} list...`}
			/>
		);
	}

	if (instrumentListQuery.isError) {
		return (
			<ErrorComponent
				errorMessage={`Error fetching ${instrumentTypeText(
					instrumentType
				)} list`}
			/>
		);
	}

	if (instrumentQueries.some((mfq) => mfq.isFetching)) {
		return (
			<LoadingComponent
				loadingMessage={`Fetching ${instrumentTypeText(
					instrumentType
				)} data...`}
			/>
		);
	}

	if (instrumentQueries.some((mfq) => mfq.isError)) {
		return (
			<ErrorComponent
				errorMessage={`Error fetching ${instrumentTypeText(
					instrumentType
				)} data`}
			/>
		);
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

	const rollingWindow = searchParams.get('rollingWindow')
		? (searchParams.get('rollingWindow') as PresetTimeDurations)
		: PresetTimeDurations.TwoYears;

	const rollingReturnType = searchParams.get('rollingReturnType')
		? (searchParams.get('rollingReturnType') as RollingReturnType)
		: RollingReturnType.Avg;

	const addedInstruments = (instrumentQueries || [])
		.map((r) => r.data!)
		.filter((instrument) => instrument !== null && !!instrument.name);

	const returnRequest = {
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
				<ReturnsForm {...returnRequest} />
				{!isMobile && (
					<ReturnsChartCard
						instrumentType={instrumentType}
						instruments={addedInstruments}
						returnRequest={returnRequest}
					/>
				)}
				<RollingReturnsTableCard
					instrumentType={instrumentType}
					instruments={addedInstruments}
					returnRequest={returnRequest}
				/>
			</div>
			<div className='order-1 md:order-2'>
				<SelectInstrumentsCard
					instrumentType={instrumentType}
					instrumentList={instrumentListQuery.data!}
					addedInstruments={addedInstruments}
				/>
			</div>
		</div>
	);
}
