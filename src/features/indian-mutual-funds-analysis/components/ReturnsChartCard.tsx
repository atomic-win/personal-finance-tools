'use client';
import { useReturnQueries } from '@/features/indian-mutual-funds-analysis/hooks/mutualfunds';
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
import { formatISO } from 'date-fns';

export default function ReturnsChartCard(
	props: {
		mutualfunds: MutualFund[];
	} & ReturnRequest,
) {
	return (
		<Card className='rounded-lg shadow-md w-full'>
			<CardHeader className='flex flex-col md:flex-row md:items-center gap-4 space-y-2 md:space-y-0 border-b py-4'>
				<div className='grid text-center md:text-left w-full gap-2'>
					<CardTitle>{returnTypeText(props.returnType)}</CardTitle>
					<CardDescription>
						{`Showing ${investmentDurationWithReturnTypeText(
							props.investmentDuration,
							props.returnType,
						)} for the last ${displayPresetTimeDuration(props.rollingWindow)}`}
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent className='p-6'>
				<ReturnsChart {...props} />
			</CardContent>
		</Card>
	);
}

function ReturnsChart(
	props: {
		mutualfunds: MutualFund[];
	} & ReturnRequest,
) {
	const { mutualfunds } = props;

	const mutualFundReturnQueries = useReturnQueries(props);

	if (mutualfunds.length === 0) {
		return (
			<div className='flex items-center justify-center'>
				<Label>No mutual funds selected</Label>
			</div>
		);
	}

	if (mutualFundReturnQueries.some((r) => r.isFetching)) {
		return <LoadingComponent loadingMessage='Calculating returns...' />;
	}

	if (mutualFundReturnQueries.some((r) => r.isError)) {
		return (
			<ErrorComponent errorMessage='Error occurred while calculating returns' />
		);
	}

	const mutualFundReturns: Return[] = mutualFundReturnQueries
		.map((r) => r.data)
		.filter((r) => !!r)
		.map((r) => r!)
		.flat();

	const chartConfig = mutualfunds.reduce(
		(acc, mutualfund, i) => ({
			...acc,
			[mutualfund.schemeCode.toString()]: {
				label: mutualfund.schemeName,
				color: `var(--chart-${i + 1})`,
			},
		}),
		{},
	) as ChartConfig;

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
			[r.schemeCode.toString()]: Number(r.return.toFixed(2)),
		});
	});

	const chartData = Array.from(chartDataMap.values()).sort((a, b) =>
		a.date.localeCompare(b.date),
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
							props.investmentDuration,
							props.returnType,
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
											{formatISO(
												new Date(
													item.payload.date as number,
												),
												{
													representation: 'date',
												},
											)}
										</div>
									)}
									<div
										className='h-2.5 w-2.5 shrink-0 rounded-[2px]'
										style={{
											backgroundColor:
												chartConfig[
													name as keyof typeof chartConfig
												]!.color,
										}}
									/>
									{
										chartConfig[
											name as keyof typeof chartConfig
										]!.label
									}
									<div className='ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground'>
										{value}%
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
						unit={'%'}
					/>
				))}
				<ChartLegend content={<ChartLegendContent />} />
			</LineChart>
		</ChartContainer>
	);
}
