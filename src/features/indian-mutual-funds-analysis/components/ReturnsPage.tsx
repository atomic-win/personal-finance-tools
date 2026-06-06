import { useSearch } from '@tanstack/react-router';
import SidebarTriggerWithBreadcrumb from '@/components/sidebar-trigger-with-breadcrumb';
import ReturnsChartCard from '@/features/indian-mutual-funds-analysis/components/ReturnsChartCard';
import ReturnsForm from '@/features/indian-mutual-funds-analysis/components/ReturnsForm';
import RollingReturnsTableCard from '@/features/indian-mutual-funds-analysis/components/RollingReturnsTableCard';
import SelectMutualFundsCard from '@/features/indian-mutual-funds-analysis/components/SelectMutualFundsCard';
import {
	Frequency,
	PresetTimeDurations,
	type ReturnRequest,
	type ReturnType,
	RollingReturnType,
} from '@/features/indian-mutual-funds-analysis/lib/types';

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
	return (
		<>
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
				<h1 className='text-2xl font-bold'>Indian Mutual Funds Analysis</h1>
				<h2 className='text-lg font-semibold'>{title} Returns</h2>
				<p>{description}</p>
				<ReturnsPageContainer returnType={returnType} />
			</div>
		</>
	);
}

function ReturnsPageContainer({ returnType }: { returnType: ReturnType }) {
	const search = useSearch({ strict: false }) as Record<string, string>;

	const frequency = (search.frequency as Frequency) || Frequency.Monthly;

	const stepUpFrequency =
		(search.stepUpFrequency as Frequency) || Frequency.Yearly;

	const stepUpRatio = search.stepUpRatio ? Number(search.stepUpRatio) : 0.1;

	const investmentDuration =
		(search.investmentDuration as PresetTimeDurations) ||
		PresetTimeDurations.OneYear;

	const rollingWindow =
		(search.rollingWindow as PresetTimeDurations) ||
		PresetTimeDurations.TwoYears;

	const rollingReturnType =
		(search.rollingReturnType as RollingReturnType) || RollingReturnType.Avg;

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
