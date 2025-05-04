import { useRollingReturnQuery } from '@/features/indian-mutual-funds-analysis/hooks/mutualfunds';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	MutualFund,
	PresetTimeDurations,
	ReturnRequest,
} from '@/features/indian-mutual-funds-analysis/lib/types';
import { cn } from '@/lib/utils';
import { displayPresetTimeDuration } from '@/features/indian-mutual-funds-analysis/lib/utils';

export default function RollingReturnsTableCard(
	props: {
		mutualfunds: MutualFund[];
	} & Omit<ReturnRequest, 'returnWindow'>
) {
	return (
		<Card className='rounded-lg shadow-md w-full'>
			<CardHeader>
				<CardTitle>
					Latest Rolling {props.returnType === 'simple' ? 'CAGR' : 'XIRR'} (%)
				</CardTitle>
			</CardHeader>
			<CardContent>
				<RollingReturnsTable {...props} />
			</CardContent>
		</Card>
	);
}

function RollingReturnsTable(
	props: {
		mutualfunds: MutualFund[];
	} & Omit<ReturnRequest, 'returnWindow'>
) {
	const { mutualfunds } = props;

	if (mutualfunds.length === 0) {
		return (
			<div className='flex items-center justify-center'>
				<Label>No mutual funds selected</Label>
			</div>
		);
	}

	return (
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
							{displayPresetTimeDuration(duration as PresetTimeDurations)}
						</TableCell>
						{mutualfunds.map((mf) => (
							<RollingReturnsTableCell
								key={mf.schemeCode}
								{...props}
								mutualfund={mf}
								returnWindow={duration as PresetTimeDurations}
							/>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

function RollingReturnsTableCell(
	props: {
		mutualfund: MutualFund;
	} & ReturnRequest
) {
	const { data: returns, isLoading, isError } = useRollingReturnQuery(props);

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
			<span className={cn(value < 0 ? 'text-red-600' : 'text-green-600')}>
				{value.toFixed(2)}%
			</span>
		</div>
	);
}
