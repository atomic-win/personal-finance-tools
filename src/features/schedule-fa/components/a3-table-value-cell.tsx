import { TableCell } from '@/components/ui/table';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {
	formatAmount,
	type DatedValue,
} from '@/features/schedule-fa/lib/calculations';

export default function A3TableValueCell({
	values,
}: { values: DatedValue[] }) {
	if (values.length === 0) {
		return <TableCell className='text-right'>₹0</TableCell>;
	}

	return (
		<TableCell className='text-right'>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger className='cursor-help underline decoration-dotted underline-offset-4'>
						{formatAmount(values)}
					</TooltipTrigger>
					<TooltipContent className='max-w-sm'>
						<table className='text-xs'>
							<thead>
								<tr>
									<th className='pr-3 text-left'>Date</th>
									<th className='pr-3 text-right'>Units</th>
									<th className='pr-3 text-right'>Price</th>
									<th className='pr-3 text-left'>TTBR Date</th>
									<th className='pr-3 text-right'>TTBR</th>
									<th className='text-right'>INR</th>
								</tr>
							</thead>
							<tbody>
								{values.map((v, i) => (
									<tr key={i.toString()}>
										<td className='pr-3'>{v.date}</td>
										<td className='pr-3 text-right'>
											{Number(v.units.toFixed(3))}
										</td>
										<td className='pr-3 text-right'>
											{Number(v.price.toFixed(2))}
										</td>
										<td className='pr-3'>{v.exchangeRate.date}</td>
										<td className='pr-3 text-right'>
											{Number(v.exchangeRate.rate.toFixed(2))}
										</td>
										<td className='text-right'>
											₹
											{Math.round(
												v.units * v.price * v.exchangeRate.rate
											).toLocaleString('en-IN')}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</TableCell>
	);
}
