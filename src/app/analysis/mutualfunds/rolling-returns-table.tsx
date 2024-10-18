import {
	MutualFund,
	useRollingReturnsQuery,
} from '@/components/hooks/mutualfunds';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { PresetTimeDurations } from '@/lib/types';
import { cn, displayPresetTimeDuration } from '@/lib/utils';

export default function RollingReturnsTable({
	mutualfunds,
	investmentDuration,
}: {
	mutualfunds: MutualFund[];
	investmentDuration: PresetTimeDurations;
}) {
	if (!mutualfunds.length) {
		return null;
	}

	return (
		<Card className='mx-auto my-2 p-2 rounded-lg shadow-md w-full col-span-2'>
			<CardHeader>
				<CardTitle>
					{displayPresetTimeDuration(investmentDuration)} Rolling Returns Table
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Table className='w-full'>
					<TableHeader>
						<TableRow>
							<TableHead>Rolling Window</TableHead>
							{mutualfunds.map((mf) => (
								<TableHead key={mf.schemeCode} className='text-center'>
									{mf.schemeName}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{Object.values(PresetTimeDurations).map((duration) => (
							<TableRow key={duration}>
								<TableCell>
									Last{' '}
									{displayPresetTimeDuration(duration as PresetTimeDurations)}
								</TableCell>
								{mutualfunds.map((mf) => (
									<RollingReturnsTableCell
										key={mf.schemeCode}
										mutualfund={mf}
										investmentDuration={investmentDuration}
										lookback={duration as PresetTimeDurations}
									/>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

function RollingReturnsTableCell({
	mutualfund,
	investmentDuration,
	lookback,
}: {
	mutualfund: MutualFund;
	investmentDuration: PresetTimeDurations;
	lookback: PresetTimeDurations;
}) {
	const {
		data: returns,
		isLoading,
		isError,
	} = useRollingReturnsQuery(mutualfund, investmentDuration, lookback);

	if (isLoading) {
		return <TableCell className='text-center'>Loading...</TableCell>;
	}

	if (isError || !returns) {
		return <TableCell className='text-center'>Error</TableCell>;
	}

	if (returns.noData) {
		return <TableCell className='text-center'>-</TableCell>;
	}

	return (
		<TableCell>
			<div className='mx-auto w-fit'>
				<RollingReturnsValue label='Avg' value={returns.avgReturn} />
				<RollingReturnsValue label='Min' value={returns.minReturn} />
				<RollingReturnsValue label='Max' value={returns.maxReturn} />
			</div>
		</TableCell>
	);
}

function RollingReturnsValue({
	label,
	value,
}: {
	label: string;
	value: number;
}) {
	return (
		<div className='font-semibold'>
			<span>{label}: </span>
			<span className={cn(value < 0 ? 'text-red-500' : 'text-green-500')}>
				{value.toFixed(2)}%
			</span>
		</div>
	);
}
