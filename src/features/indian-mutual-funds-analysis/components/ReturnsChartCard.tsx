'use client';
import { useReturnQueries } from '@/features/indian-mutual-funds-analysis/hooks/returns';
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
	Instrument,
	Return,
	ReturnRequest,
} from '@/features/indian-mutual-funds-analysis/lib/types';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { Label } from '@/components/ui/label';
import {
	displayPresetTimeDuration,
	investmentDurationWithReturnTypeText,
	returnTypeText,
} from '@/features/indian-mutual-funds-analysis/lib/utils';
import LoadingComponent from '@/components/LoadingComponent';
import ErrorComponent from '@/components/ErrorComponent';

export default function ReturnsChartCard(props: {
	instruments: Instrument[];
	returnRequest: ReturnRequest;
}) {
	const { returnRequest } = props;

	return (
		<Card className='rounded-lg shadow-md w-full'>
			<CardHeader className='flex flex-col md:flex-row md:items-center gap-4 space-y-2 md:space-y-0 border-b py-4'>
				<div className='grid text-center md:text-left w-full gap-2'>
					<CardTitle>{returnTypeText(returnRequest.returnType)}</CardTitle>
					<CardDescription>
						{`Showing ${investmentDurationWithReturnTypeText(
							returnRequest.investmentDuration,
							returnRequest.returnType
						)} for the last ${displayPresetTimeDuration(
							returnRequest.rollingWindow
						)}`}
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent className='p-6'>
				<ReturnsChart {...props} />
			</CardContent>
		</Card>
	);
}

function ReturnsChart(props: {
	instruments: Instrument[];
	returnRequest: ReturnRequest;
}) {
	const { instruments, returnRequest } = props;

	const returnQueries = useReturnQueries(returnRequest, instruments);

	if (instruments.length === 0) {
		return (
			<div className='flex items-center justify-center'>
				<Label>No mutual funds selected</Label>
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
		.map((r) => r!)
		.flat();

	const chartConfig = instruments.reduce(
		(acc, instrument, i) => ({
			...acc,
			[instrument.symbol.toString()]: {
				label: instrument.name,
				color: `var(--chart-${i + 1})`,
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

	instrumentReturns.forEach((r) => {
		const date = r.date;

		if (!chartDataMap.has(date)) {
			chartDataMap.set(date, {
				date,
			});
		}

		const data = chartDataMap.get(date)!;
		chartDataMap.set(date, {
			...data,
			[r.symbol.toString()]: Number(r.return.toFixed(2)),
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
					content={<ChartTooltipContent unit='%' />}
				/>
				{instruments.map((instrument) => (
					<Line
						key={instrument.symbol}
						dataKey={instrument.symbol.toString()}
						type='monotone'
						stroke={`var(--color-${instrument.symbol})`}
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
