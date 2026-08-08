import { useSearch } from '@tanstack/react-router';
import SidebarTriggerWithBreadcrumb from '@/components/sidebar-trigger-with-breadcrumb';
import ReturnsChartCard from '@/features/investment-analysis/components/returns-chart-card';
import ReturnsForm from '@/features/investment-analysis/components/returns-form';
import RollingReturnsTableCard from '@/features/investment-analysis/components/rolling-returns-table-card';
import SelectIndexesCard from '@/features/investment-analysis/components/select-indexes-card';
import SelectMutualFundsCard from '@/features/investment-analysis/components/select-mutual-funds-card';
import {
	Frequency,
	PresetTimeDurations,
	type ReturnRequest,
	type ReturnType,
	RollingReturnType,
} from '@/features/investment-analysis/lib/types';

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
						title: 'Investment Analysis',
						href: '',
						disabled: true,
					},
					{ title: `${title} Returns`, href, disabled: true },
				]}
			/>
			<div className='px-4 space-y-2'>
				<h1 className='text-2xl font-bold'>Investment Analysis</h1>
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
			<div className='order-1 md:order-2 space-y-4'>
				<SelectMutualFundsCard />
				<SelectIndexesCard />
			</div>
		</div>
	);
}
