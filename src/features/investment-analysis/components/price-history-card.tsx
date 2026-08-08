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
import { withInstruments } from '@/features/investment-analysis/hoc/with-instruments';
import {
	type Instrument,
	PresetTimeDurations,
} from '@/features/investment-analysis/lib/types';
import {
	displayPresetTimeDuration,
	getLuxonDuration,
} from '@/features/investment-analysis/lib/utils';
import { useCurrencyQuery } from '@/hooks/use-currency-query';
import { useLocaleQuery } from '@/hooks/use-locale-query';
import { useIsMobile } from '@/hooks/use-mobile';
import { displayCurrencyAmountText } from '@/lib/utils';

const LoadedPriceHistoryChart = withInstruments(PriceHistoryChart);

export default function PriceHistoryCard({
	timeRange,
	onTimeRangeChange,
}: {
	timeRange: PresetTimeDurations;
	onTimeRangeChange: (value: PresetTimeDurations) => void;
}) {
	const isMobile = useIsMobile();

	if (isMobile) {
		return null;
	}

	return (
		<Card className='rounded-lg shadow-md w-full'>
			<CardHeader className='flex flex-col md:flex-row md:items-center gap-4 space-y-2 md:space-y-0 border-b py-4'>
				<div className='grid text-center md:text-left w-full gap-2'>
					<CardTitle>Price History</CardTitle>
					<CardDescription>
						NAV and index levels over time for the selected mutual funds and
						indexes
					</CardDescription>
				</div>
				<Select
					value={timeRange}
					onValueChange={(v) => onTimeRangeChange(v as PresetTimeDurations)}
				>
					<SelectTrigger className='w-40 rounded-lg'>
						<SelectValue placeholder='Select range'>
							{displayPresetTimeDuration(timeRange)}
						</SelectValue>
					</SelectTrigger>
					<SelectContent className='rounded-xl'>
						{Object.values(PresetTimeDurations).map((duration) => (
							<SelectItem
								key={duration}
								value={duration}
								className='rounded-lg'
							>
								{displayPresetTimeDuration(duration)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent className='p-6'>
				<LoadedPriceHistoryChart timeRange={timeRange} />
			</CardContent>
		</Card>
	);
}

function PriceHistoryChart({
	instruments,
	timeRange,
}: {
	instruments: Instrument[];
	timeRange: PresetTimeDurations;
}) {
	const currencyQuery = useCurrencyQuery();
	const localeQuery = useLocaleQuery();

	const currency = currencyQuery.data || 'USD';
	const locale = localeQuery.data || 'en-US';

	if (instruments.length === 0) {
		return (
			<div className='flex items-center justify-center'>
				<Label>No mutual funds or indexes selected</Label>
			</div>
		);
	}

	const now = DateTime.local();
	const startDate = now.minus(getLuxonDuration(timeRange));

	const chartConfig = instruments.reduce(
		(acc, instrument, i) => ({
			// biome-ignore lint/performance/noAccumulatingSpread: Need to accumulate config for each instrument.
			...acc,
			[instrument.id]: {
				label: instrument.name,
				color: `var(--chart-${i + 1})`,
			},
		}),
		{}
	) as ChartConfig;

	const chartDataMap = new Map<number, { date: number }>();

	for (const instrument of instruments) {
		for (const [dateStr, price] of Object.entries(instrument.prices)) {
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
				[instrument.id]: price,
			});
		}
	}

	const chartData = Array.from(chartDataMap.values()).sort(
		(a, b) => a.date - b.date
	);

	if (chartData.length === 0) {
		return (
			<div className='flex items-center justify-center'>
				<Label>No price data available for the selected time range</Label>
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
					tickFormatter={(value) =>
						displayCurrencyAmountText(locale, currency, value, 'compact', 2)
					}
					label={{
						value: `Price (${currency})`,
						position: 'insideLeft',
						angle: -90,
						style: { textAnchor: 'middle' },
					}}
					padding={{
						top: 50,
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
										{displayCurrencyAmountText(
											locale,
											currency,
											Number(value),
											'standard',
											2
										)}
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
					/>
				))}
				<ChartLegend content={<ChartLegendContent />} />
			</LineChart>
		</ChartContainer>
	);
}
