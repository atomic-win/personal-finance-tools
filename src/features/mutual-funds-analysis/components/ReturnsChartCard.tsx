'use client';
import { useReturnQueries } from '@/features/mutual-funds-analysis/hooks/mutualfunds';
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
import {
	MutualFund,
	MutualFundReturn,
	PresetTimeDurations,
} from '@/features/mutual-funds-analysis/lib/types';
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
import { displayPresetTimeDuration } from '@/features/mutual-funds-analysis/lib/utils';

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
		<Card className='rounded-lg shadow-md w-full'>
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
					<Label>CAGR Window</Label>
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
					<Label>Last</Label>
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
			<CardContent className='p-6'>
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
		return (
			<div className='flex items-center justify-center'>
				<Label>No mutual funds selected</Label>
			</div>
		);
	}

	if (mutualFundReturnResults.some((r) => r.isLoading)) {
		return (
			<div className='flex items-center justify-center'>
				<Label>Loading data...</Label>
			</div>
		);
	}

	if (mutualFundReturnResults.some((r) => r.isError)) {
		return (
			<div className='flex items-center justify-center'>
				<Label>Error loading data</Label>
			</div>
		);
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

	const chartDataMap = new Map<
		string,
		{
			date: string;
		}
	>();

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

	const chartData = Array.from(chartDataMap.values()).sort((a, b) =>
		a.date.localeCompare(b.date)
	);

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
