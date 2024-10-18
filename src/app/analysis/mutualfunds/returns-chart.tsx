import {
	MutualFund,
	MutualFundReturn,
	useReturnQueries,
} from '@/components/hooks/mutualfunds';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { PresetTimeDurations } from '@/lib/types';
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';

export default function ReturnsChartCard({
	mutualfunds,
	investmentDuration,
	lookbackDuration,
}: {
	mutualfunds: MutualFund[];
	investmentDuration: PresetTimeDurations;
	lookbackDuration: PresetTimeDurations;
}) {
	return (
		<Card className='mx-auto my-2 rounded-lg shadow-md'>
			<CardHeader>
				<CardTitle>Historical Returns</CardTitle>
			</CardHeader>
			<CardContent>
				<ReturnsChart
					mutualfunds={mutualfunds}
					investmentDuration={investmentDuration}
					lookbackDuration={lookbackDuration}
				/>
			</CardContent>
		</Card>
	);
}

function ReturnsChart({
	mutualfunds,
	investmentDuration,
	lookbackDuration,
}: {
	mutualfunds: MutualFund[];
	investmentDuration: PresetTimeDurations;
	lookbackDuration: PresetTimeDurations;
}) {
	const mutualFundReturnResults = useReturnQueries(
		mutualfunds,
		investmentDuration,
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
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey='date'
					tickLine={true}
					axisLine={true}
					tickMargin={8}
					minTickGap={32}
				/>
				<YAxis tickLine={true} axisLine={true} tickMargin={8} minTickGap={32} />
				<ChartTooltip cursor={true} content={<ChartTooltipContent />} />
				{mutualfunds.map((mutualfund) => (
					<Line
						key={mutualfund.schemeCode}
						dataKey={mutualfund.schemeCode.toString()}
						name={mutualfund.schemeName} // Add this line to show label in legend
						type='monotone'
						stroke={`var(--color-${mutualfund.schemeCode})`}
						strokeWidth={2}
						dot={false}
					/>
				))}
				<Legend iconType='circle' align='center' verticalAlign='bottom' />
			</LineChart>
		</ChartContainer>
	);
}
