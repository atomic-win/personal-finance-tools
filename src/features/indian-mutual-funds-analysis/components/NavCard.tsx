'use client';
import { DateTime } from 'luxon';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { withMutualFunds } from '@/features/indian-mutual-funds-analysis/hoc/withMutualFunds';
import type { MutualFund } from '@/features/indian-mutual-funds-analysis/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';

const timeRanges = [
	{ label: '1 Month', value: '1m', duration: { months: 1 } },
	{ label: '3 Months', value: '3m', duration: { months: 3 } },
	{ label: '6 Months', value: '6m', duration: { months: 6 } },
	{ label: '1 Year', value: '1y', duration: { years: 1 } },
	{ label: '3 Years', value: '3y', duration: { years: 3 } },
	{ label: '5 Years', value: '5y', duration: { years: 5 } },
	{ label: '10 Years', value: '10y', duration: { years: 10 } },
	{ label: 'All Time', value: 'all', duration: {} },
] as const;

type TimeRange = (typeof timeRanges)[number]['value'];

const LoadedNavChart = withMutualFunds(NavChart);

export default function NavChartCard({
	timeRange,
	onTimeRangeChange,
}: {
	timeRange: TimeRange;
	onTimeRangeChange: (value: TimeRange) => void;
}) {
	const isMobile = useIsMobile();

	if (isMobile) {
		return null;
	}

	return (
		<Card className='rounded-lg shadow-md w-full'>
			<CardHeader className='flex flex-col md:flex-row md:items-center gap-4 space-y-2 md:space-y-0 border-b py-4'>
				<div className='grid text-center md:text-left w-full gap-2'>
					<CardTitle>NAV History</CardTitle>
					<CardDescription>
						Net Asset Value over time for selected mutual funds
					</CardDescription>
				</div>
				<Select
					value={timeRange}
					onValueChange={(v) => onTimeRangeChange(v as TimeRange)}
				>
					<SelectTrigger className='w-40 rounded-lg'>
						<SelectValue placeholder='Select range' />
					</SelectTrigger>
					<SelectContent className='rounded-xl'>
						{timeRanges.map((range) => (
							<SelectItem
								key={range.value}
								value={range.value}
								className='rounded-lg'
							>
								{range.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent className='p-6'>
				<LoadedNavChart timeRange={timeRange} />
			</CardContent>
		</Card>
	);
}

function NavChart({
	mutualfunds,
	timeRange,
}: {
	mutualfunds: MutualFund[];
	timeRange: TimeRange;
}) {
	if (mutualfunds.length === 0) {
		return (
			<div className='flex items-center justify-center'>
				<Label>No mutual funds selected</Label>
			</div>
		);
	}

	const selectedRange = timeRanges.find((r) => r.value === timeRange);
	const now = DateTime.local();
	const startDate =
		timeRange === 'all'
			? DateTime.fromISO('1900-01-01')
			: now.minus(selectedRange?.duration ?? {});

	const chartConfig = mutualfunds.reduce(
		(acc, mutualfund, i) => ({
			// biome-ignore lint/performance/noAccumulatingSpread: Need to accumulate config for each mutual fund.
			...acc,
			[mutualfund.schemeCode.toString()]: {
				label: mutualfund.schemeName,
				color: `var(--chart-${i + 1})`,
			},
		}),
		{}
	) as ChartConfig;

	const chartDataMap = new Map<number, { date: number }>();

	for (const mutualfund of mutualfunds) {
		for (const [dateStr, nav] of Object.entries(mutualfund.navs)) {
			const dt = DateTime.fromISO(dateStr);
			if (dt < startDate) continue;

			const millis = dt.toMillis();
			if (!chartDataMap.has(millis)) {
				chartDataMap.set(millis, { date: millis });
			}

			// biome-ignore lint/style/noNonNullAssertion: We just ensured this above with the has() check.
			const data = chartDataMap.get(millis)!;
			chartDataMap.set(millis, {
				...data,
				[mutualfund.schemeCode.toString()]: nav,
			});
		}
	}

	const chartData = Array.from(chartDataMap.values()).sort(
		(a, b) => a.date - b.date
	);

	if (chartData.length === 0) {
		return (
			<div className='flex items-center justify-center'>
				<Label>No NAV data available for the selected time range</Label>
			</div>
		);
	}

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
					tickFormatter={(value) =>
						DateTime.fromMillis(value).toISODate() ?? ''
					}
				/>
				<YAxis
					tickLine={true}
					axisLine={true}
					tickMargin={8}
					minTickGap={32}
					label={{
						value: 'NAV (₹)',
						position: 'insideLeft',
						angle: -90,
						style: { textAnchor: 'middle' },
					}}
				/>
				<ChartTooltip
					cursor={true}
					content={
						<ChartTooltipContent
							hideLabel
							className='w-full'
							formatter={(value, name, item, index) => (
								<>
									{index === 0 && (
										<div className='flex basis-full items-center pt-1.5 text-xs font-medium text-foreground'>
											{DateTime.fromMillis(item.payload.date).toISODate()}
										</div>
									)}
									<div
										className='h-2.5 w-2.5 shrink-0 rounded-[2px]'
										style={{
											backgroundColor:
												chartConfig[name as keyof typeof chartConfig]?.color,
										}}
									/>
									{chartConfig[name as keyof typeof chartConfig]?.label}
									<div className='ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground'>
										₹{value}
									</div>
								</>
							)}
						/>
					}
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
