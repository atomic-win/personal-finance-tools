import { DateTime } from 'luxon';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import ErrorComponent from '@/components/error-component';
import LoadingComponent from '@/components/loading-component';
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
import { withInstruments } from '@/features/investment-analysis/hoc/with-instruments';
import { useReturnQueries } from '@/features/investment-analysis/hooks/instruments';
import type {
	Instrument,
	Return,
	ReturnRequest,
} from '@/features/investment-analysis/lib/types';
import {
	displayPresetTimeDuration,
	investmentDurationWithReturnTypeText,
	returnTypeText,
} from '@/features/investment-analysis/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const LoadedReturnsChart = withInstruments(ReturnsChart);

export default function ReturnsChartCard({
	returnRequest,
}: {
	returnRequest: ReturnRequest;
}) {
	const isMobile = useIsMobile();

	if (isMobile) {
		return null;
	}

	return (
		<Card className='rounded-lg shadow-md w-full'>
			<CardHeader className='flex flex-col md:flex-row md:items-center gap-4 space-y-2 md:space-y-0 border-b py-4'>
				<div className='grid text-center md:text-left w-full gap-2'>
					<CardTitle>{returnTypeText(returnRequest.returnType)}</CardTitle>
					<CardDescription>
						{`Showing ${investmentDurationWithReturnTypeText(
							returnRequest.investmentDuration,
							returnRequest.returnType
						)} for the last ${displayPresetTimeDuration(returnRequest.rollingWindow)}`}
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent className='p-6'>
				<LoadedReturnsChart returnRequest={returnRequest} />
			</CardContent>
		</Card>
	);
}

function ReturnsChart({
	instruments,
	returnRequest,
}: {
	instruments: Instrument[];
	returnRequest: ReturnRequest;
}) {
	const returnQueries = useReturnQueries(returnRequest, instruments);

	if (instruments.length === 0) {
		return (
			<div className='flex items-center justify-center'>
				<Label>No mutual funds or indexes selected</Label>
			</div>
		);
	}

	if (returnQueries.some((r) => r.isFetching)) {
		return <LoadingComponent loadingMessage='Calculating returns...' />;
	}

	if (returnQueries.some((r) => r.isError)) {
		return (
			<ErrorComponent errorMessage='Error occurred while calculating returns' />
		);
	}

	const instrumentReturns: Return[] = returnQueries
		.map((r) => r.data)
		.filter((r) => !!r)
		.flat();

	const chartConfig = instruments.reduce(
		(acc, instrument, i) => ({
			// biome-ignore lint/performance/noAccumulatingSpread: We need to accumulate the config for each instrument to create the final chart config.
			...acc,
			[instrument.id]: {
				label: instrument.name,
				color: `var(--chart-${i + 1})`,
			},
		}),
		{}
	) as ChartConfig;

	const chartDataMap = new Map<
		number,
		{
			date: number;
		}
	>();

	instrumentReturns.forEach((r) => {
		const date = DateTime.fromISO(r.date).toMillis();

		if (!chartDataMap.has(date)) {
			chartDataMap.set(date, {
				date,
			});
		}

		// biome-ignore lint/style/noNonNullAssertion: We are sure that the data will always be available as we are controlling the date range and format.
		const data = chartDataMap.get(date)!;
		chartDataMap.set(date, {
			...data,
			[r.instrumentId]: Number(r.return.toFixed(2)),
		});
	});

	const chartData = Array.from(chartDataMap.values()).sort(
		(a, b) => a.date - b.date
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
					// biome-ignore lint/style/noNonNullAssertion: We are sure that the date will always be valid as we are controlling the date format.
					tickFormatter={(value) => DateTime.fromMillis(value).toISODate()!}
				/>
				<YAxis
					tickLine={true}
					axisLine={true}
					tickMargin={8}
					minTickGap={32}
					unit={'%'}
					label={{
						value: investmentDurationWithReturnTypeText(
							returnRequest.investmentDuration,
							returnRequest.returnType
						),
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
									{/* Add this before the first item */}
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
										{value}%
									</div>
								</>
							)}
						/>
					}
				/>
				{instruments.map((instrument) => (
					<Line
						key={instrument.id}
						dataKey={instrument.id}
						type='monotone'
						stroke={chartConfig[instrument.id]?.color}
						strokeWidth={2}
						dot={false}
						unit={'%'}
					/>
				))}
				<ChartLegend content={<ChartLegendContent />} />
			</LineChart>
		</ChartContainer>
	);
}
