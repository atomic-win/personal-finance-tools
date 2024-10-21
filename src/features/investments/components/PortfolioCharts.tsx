import { Card, CardTitle, CardContent } from '@/components/ui/card';
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	ChartLegend,
	ChartLegendContent,
} from '@/components/ui/chart';
import { Pie, PieChart } from 'recharts';
import { Portfolio } from '@/features/investments/lib/types';

export default function PortfolioCharts<TPortfolio extends Portfolio>({
	portfolios,
	labelFn,
}: {
	portfolios: TPortfolio[];
	labelFn: (portfolio: TPortfolio) => string;
}) {
	return (
		<div className='grid grid-cols-2 gap-2'>
			<PortfolioChart
				portfolios={portfolios}
				labelFn={labelFn}
				title='Invested Value Allocation (%)'
				valuePercentFn={(portfolio) => portfolio.initialAmountPercent}
			/>
			<PortfolioChart
				portfolios={portfolios}
				labelFn={labelFn}
				title='Current Value Allocation (%)'
				valuePercentFn={(portfolio) => portfolio.currentAmountPercent}
			/>
		</div>
	);
}

function PortfolioChart<TPortfolio extends Portfolio>({
	portfolios,
	labelFn,
	title,
	valuePercentFn,
}: {
	portfolios: TPortfolio[];
	labelFn: (portfolio: TPortfolio) => string;
	title: string;
	valuePercentFn: (portfolio: TPortfolio) => number;
}) {
	const chartConfig = portfolios.reduce(
		(acc, portfolio, i) => ({
			...acc,
			[portfolio.id]: {
				label: labelFn(portfolio),
				color: `hsl(var(--chart-${i + 1}))`,
			},
		}),
		{}
	) satisfies ChartConfig;

	const chartData = portfolios
		.sort((a, b) => valuePercentFn(a) - valuePercentFn(b))
		.reverse()
		.map((portfolio) => ({
			id: portfolio.id,
			data: parseFloat(valuePercentFn(portfolio).toFixed(2)),
			fill: `var(--color-${portfolio.id})`,
		}));

	return (
		<Card className='m-auto rounded-lg shadow-md w-full'>
			<CardTitle className='text-center m-2 text-base'>{title}</CardTitle>
			<CardContent className='p-2'>
				<ChartContainer
					config={chartConfig}
					className='mx-auto aspect-square max-h-80'>
					<PieChart>
						<ChartTooltip
							content={
								<ChartTooltipContent
									hideLabel
									className='w-full'
									formatter={(value, name) => (
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
												{value}
												<span className='font-normal text-muted-foreground'>
													%
												</span>
											</div>
										</>
									)}
								/>
							}
							cursor={false}
						/>
						<Pie
							data={chartData}
							dataKey='data'
							nameKey='id'
							innerRadius={40}
						/>
						<ChartLegend
							content={<ChartLegendContent />}
							className='grid grid-cols-2 gap-2 p-0'
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
