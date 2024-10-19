'use client';
import {
	MutualFund,
	MutualFundReturn,
	useReturnQueries,
} from '@/components/hooks/mutualfunds';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
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
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { useState } from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function ReturnsChartCard({
	mutualfunds,
}: {
	mutualfunds: MutualFund[];
}) {
	const [returnWindow, setReturnWindow] = useState<PresetTimeDurations>(
		PresetTimeDurations.OneYear
	);

	const [lookbackDuration, setLookbackDuration] = useState<PresetTimeDurations>(
		PresetTimeDurations.TwoYears
	);

	return (
		<Card className='mx-auto my-2 rounded-lg shadow-md'>
			<CardHeader className='flex items-center gap-4 space-y-0 border-b py-4 sm:flex-row'>
				<div className='grid text-center sm:text-left w-full gap-2'>
					<CardTitle>CAGR (%)</CardTitle>
					<CardDescription>
						{`Showing ${displayPresetTimeDuration(
							returnWindow
						)} CAGR % for the last ${displayPresetTimeDuration(
							lookbackDuration
						)}`}
					</CardDescription>
				</div>
				<div className='w-1/2'>
					<Label>Return Window</Label>
					<Select
						onValueChange={(x) => setReturnWindow(x as PresetTimeDurations)}
						value={returnWindow.toString()}>
						<SelectTrigger
							className='w-full rounded-lg sm:ml-auto'
							aria-label='Select a value'>
							<SelectValue
								placeholder={`Last ${displayPresetTimeDuration(returnWindow)}`}
							/>
						</SelectTrigger>
						<SelectContent className='rounded-xl'>
							{Object.values(PresetTimeDurations).map((duration) => (
								<SelectItem
									key={duration}
									value={duration}
									className='rounded-lg'>
									{displayPresetTimeDuration(duration)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className='w-1/2'>
					<Label>Lookback Duration</Label>
					<Select
						onValueChange={(x) => setLookbackDuration(x as PresetTimeDurations)}
						value={lookbackDuration.toString()}>
						<SelectTrigger
							className='w-full rounded-lg sm:ml-auto'
							aria-label='Select a value'>
							<SelectValue
								placeholder={`Last ${displayPresetTimeDuration(
									lookbackDuration
								)}`}
							/>
						</SelectTrigger>
						<SelectContent className='rounded-xl'>
							{Object.values(PresetTimeDurations).map((duration) => (
								<SelectItem
									key={duration}
									value={duration}
									className='rounded-lg'>
									{displayPresetTimeDuration(duration)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
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
