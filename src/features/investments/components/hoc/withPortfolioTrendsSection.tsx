import { Portfolio } from '@/features/investments/lib/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { CartesianGrid, XAxis, YAxis, Line, LineChart } from 'recharts';
import {
	displayCurrencyAmount,
	displayPercentage,
	displayPortfolioType,
} from '@/features/investments/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

enum TrendType {
	InvestedValue = 'InvestedValue',
	CurrentValue = 'CurrentValue',
	XIRR = 'XIRR',
}

export default function withPortfolioTrendsSection<
	TPortfolio extends Portfolio
>({ labelFn }: { labelFn: (portfolio: TPortfolio) => string }) {
	return function PortfolioTrendsSection({
		portfolios,
	}: {
		portfolios: TPortfolio[];
	}) {
		const searchParams = useSearchParams();
		const pathname = usePathname();
		const { replace } = useRouter();

		const activeTrendType =
			(searchParams.get('trendType') as TrendType) || TrendType.InvestedValue;

		function handleTabChange(trendType: TrendType) {
			const params = new URLSearchParams(searchParams);
			params.set('trendType', trendType);
			replace(`${pathname}?${params.toString()}`);
		}

		const latestPortfolios = filterLatestPortfolios(portfolios);

		const chartConfig = latestPortfolios
			.sort((a, b) => a.initialAmountPercent - b.initialAmountPercent)
			.reverse()
			.reduce(
				(acc, portfolio, i) => ({
					...acc,
					[portfolio.id]: {
						label: labelFn(portfolio),
						color: `hsl(var(--chart-${i + 1}))`,
					},
				}),
				{}
			) satisfies ChartConfig;

		const portfolioIds = latestPortfolios.map((p) => p.id);
		const currency = portfolios[0].currency;

		return (
			<Tabs
				value={activeTrendType}
				onValueChange={(value) => handleTabChange(value as TrendType)}>
				<TabsList className='grid w-full grid-cols-3'>
					<TabsTrigger value={TrendType.InvestedValue}>
						{displayTrendType(TrendType.InvestedValue)}
					</TabsTrigger>
					<TabsTrigger value={TrendType.CurrentValue}>
						{displayTrendType(TrendType.CurrentValue)}
					</TabsTrigger>
					<TabsTrigger value={TrendType.XIRR}>
						{displayTrendType(TrendType.XIRR)}
					</TabsTrigger>
				</TabsList>
				<TabsContent value={TrendType.InvestedValue}>
					<TrendsChart
						portfolioIds={portfolioIds}
						portfolios={portfolios}
						chartConfig={chartConfig}
						chartTitle='Invested Value Trend'
						valueFn={(portfolio) => portfolio.initialAmount}
						yAxisFormat={(value) => displayCurrencyAmount(currency, value)}
						showTotalInTooltip={true}
					/>
				</TabsContent>
				<TabsContent value={TrendType.CurrentValue}>
					<TrendsChart
						portfolioIds={portfolioIds}
						portfolios={portfolios}
						chartConfig={chartConfig}
						chartTitle='Current Value Trend'
						valueFn={(portfolio) => portfolio.currentAmount}
						yAxisFormat={(value) => displayCurrencyAmount(currency, value)}
						showTotalInTooltip={true}
					/>
				</TabsContent>
				<TabsContent value={TrendType.XIRR}>
					<TrendsChart
						portfolioIds={portfolioIds}
						portfolios={portfolios}
						chartConfig={chartConfig}
						chartTitle='XIRR % Trend'
						valueFn={(portfolio) => portfolio.xirrPercent}
						yAxisFormat={(value) => displayPercentage(value)}
						showTotalInTooltip={false}
					/>
				</TabsContent>
			</Tabs>
		);
	};
}

function TrendsChart<TPortfolio extends Portfolio>({
	portfolioIds,
	portfolios,
	chartConfig,
	chartTitle,
	valueFn,
	yAxisFormat,
	showTotalInTooltip,
}: {
	portfolioIds: string[];
	portfolios: TPortfolio[];
	chartConfig: ChartConfig;
	chartTitle: string;
	valueFn: (portfolio: TPortfolio) => number;
	yAxisFormat: (value: number) => string;
	showTotalInTooltip: boolean;
}) {
	const chartDataMap = new Map<
		string,
		{
			date: string;
		}
	>();

	portfolios.forEach((portfolio) => {
		const date = portfolio.date;

		if (!chartDataMap.has(date)) {
			chartDataMap.set(date, {
				date,
			});
		}

		const data = chartDataMap.get(date)!;
		chartDataMap.set(date, {
			...data,
			[portfolio.id]: valueFn(portfolio),
		});
	});

	const chartData = Array.from(chartDataMap.values()).sort((a, b) =>
		a.date.localeCompare(b.date)
	);

	return (
		<Card className='mx-auto my-2 rounded-lg shadow-md'>
			<CardHeader className='flex items-center gap-4 space-y-0 p-4 mt-2 sm:flex-row'>
				<div className='grid text-center sm:text-left w-full gap-2 justify-center'>
					<CardTitle>
						{chartTitle} - {displayPortfolioType(portfolios[0].type)}
					</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className='mt-2'>
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
							tickFormatter={yAxisFormat}
						/>
						<ChartTooltip
							cursor={true}
							content={
								<ChartTooltipContent
									hideLabel
									className='w-full'
									formatter={(value, name, item, index) => (
										<>
											<div
												className='h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]'
												style={
													{
														'--color-bg': `var(--color-${name})`,
													} as React.CSSProperties
												}
											/>
											{chartConfig[name as keyof typeof chartConfig]?.label ||
												name}
											<div className='ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground'>
												{yAxisFormat(value as number)}
											</div>
											{/* Add this after the last item */}
											{showTotalInTooltip &&
												index === Object.keys(item.payload).length - 2 && (
													<div className='mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground'>
														Total
														<div className='ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground'>
															{yAxisFormat(
																portfolioIds
																	.map((id) => item.payload[id])
																	.filter((value) => value !== undefined)
																	.reduce((acc, value) => acc + value, 0)
															)}
														</div>
													</div>
												)}
										</>
									)}
								/>
							}
						/>
						{portfolioIds.map((id) => (
							<Line
								key={id}
								type='monotone'
								dataKey={id}
								stroke={chartConfig[id].color}
								dot={false}
								strokeWidth={2}
							/>
						))}
						<ChartLegend
							content={<ChartLegendContent />}
							className='grid grid-cols-4 gap-2 p-0'
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

function filterLatestPortfolios<TPortfolio extends Portfolio>(
	portfolios: TPortfolio[]
) {
	const latestDate = portfolios
		.map((p) => p.date)
		.reduce((acc, date) => (date > acc ? date : acc), '1900-01-01');

	return portfolios.filter((p) => p.date === latestDate);
}

function displayTrendType(trendType: TrendType) {
	switch (trendType) {
		case TrendType.InvestedValue:
			return 'Invested Value';
		case TrendType.CurrentValue:
			return 'Current Value';
		case TrendType.XIRR:
			return 'XIRR';
		default:
			throw new Error(`Unknown trend type: ${trendType}`);
	}
}
