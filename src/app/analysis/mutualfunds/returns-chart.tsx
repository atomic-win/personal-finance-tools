import {
	MutualFund,
	MutualFundReturn,
	useReturnQueries,
} from '@/components/hooks/mutualfunds';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { PresetTimeDurations } from '@/lib/types';
import { displayPresetTimeDuration } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import ReturnsForm from './returns-form';

export default function ReturnsChartCard({
	mutualfunds,
}: {
	mutualfunds: MutualFund[];
}) {
	const searchParams = useSearchParams();

	const returnWindow =
		(searchParams.get('returnWindow') as unknown as PresetTimeDurations) ||
		PresetTimeDurations.OneYear;

	const lookbackDuration =
		(searchParams.get('lookbackDuration') as unknown as PresetTimeDurations) ||
		PresetTimeDurations.TwoYears;

	return (
		<Card className='mx-auto my-2 rounded-lg shadow-md'>
			<CardHeader>
				<CardTitle>{`${displayPresetTimeDuration(
					returnWindow
				)} CAGR (%)`}</CardTitle>
				<ReturnsForm
					returnWindow={returnWindow}
					lookbackDuration={lookbackDuration}
				/>
			</CardHeader>
			<CardContent>
				<ReturnsChart
					mutualfunds={mutualfunds}
					returnWindow={returnWindow}
					lookbackDuration={lookbackDuration}
				/>
			</CardContent>
		</Card>
	);
}

function ReturnsChart({
	mutualfunds,
	returnWindow,
	lookbackDuration,
}: {
	mutualfunds: MutualFund[];
	returnWindow: PresetTimeDurations;
	lookbackDuration: PresetTimeDurations;
}) {
	const mutualFundReturnResults = useReturnQueries(
		mutualfunds,
		returnWindow,
		lookbackDuration
	);

	if (mutualfunds.length === 0) {
		return <div>No mutual funds selected</div>;
	}

	if (mutualFundReturnResults.some((r) => r.isLoading)) {
		return <div>Loading...</div>;
	}

	if (mutualFundReturnResults.some((r) => r.isError)) {
		return <div>Error fetching data</div>;
	}

	const mutualFundReturns: MutualFundReturn[] = mutualFundReturnResults
		.map((r) => r.data)
		.filter((r) => !!r)
		.map((r) => r!)
		.flat();

	const chartConfig = mutualfunds.reduce(
		(acc, mutualfund, i) => ({
			...acc,
			[mutualfund.schemeCode.toString()]: {
				label: mutualfund.schemeName,
				color: `hsl(var(--chart-${i + 1}))`,
			},
		}),
		{}
	) satisfies ChartConfig;

	const chartDataMap = new Map<string, object>();

	mutualFundReturns.forEach((r) => {
		const date = r.date;

		if (!chartDataMap.has(date)) {
			chartDataMap.set(date, {
				date,
			});
		}

		const data = chartDataMap.get(date)!;
		chartDataMap.set(date, {
			...data,
			[r.schemeCode.toString()]: r.return,
		});
	});

	const chartData = Array.from(chartDataMap.values());

	return (
		<ChartContainer config={chartConfig}>
			<LineChart accessibilityLayer data={chartData}>
				<CartesianGrid />
				<XAxis
					dataKey='date'
					tickLine={true}
					axisLine={true}
					tickMargin={8}
					minTickGap={32}
				/>
				<YAxis
					tickLine={true}
					axisLine={true}
					tickMargin={8}
					minTickGap={32}
					unit={'%'}
					label={{
						value: `${displayPresetTimeDuration(returnWindow)} CAGR (%)`,
						position: 'insideLeft',
						angle: -90,
						style: { textAnchor: 'middle' },
					}}
				/>
				<ChartTooltip
					cursor={true}
					content={<ChartTooltipContent unit='%' />}
				/>
				{mutualfunds.map((mutualfund) => (
					<Line
						key={mutualfund.schemeCode}
						dataKey={mutualfund.schemeCode.toString()}
						type='monotone'
						stroke={`var(--color-${mutualfund.schemeCode})`}
						strokeWidth={2}
						dot={false}
					/>
				))}
				<ChartLegend content={<ChartLegendContent />} />
			</LineChart>
		</ChartContainer>
	);
}
