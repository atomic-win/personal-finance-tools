import { useRollingReturnsQuery } from '@/features/returns/hooks/returns';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
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
	Instrument,
	InstrumentType,
	ReturnRequest,
	RollingReturnType,
} from '@/features/returns/lib/types';
import { cn } from '@/lib/utils';
import {
	displayPresetTimeDuration,
	instrumentTypeText,
	investmentDurationWithReturnTypeText,
	rollingReturnTypeText,
} from '@/features/returns/lib/utils';
import LoadingComponent from '@/components/LoadingComponent';
import ErrorComponent from '@/components/ErrorComponent';
import percentile from 'percentile';

export default function RollingReturnsTableCard(props: {
	instrumentType: InstrumentType;
	instruments: Instrument[];
	returnRequest: ReturnRequest;
}) {
	const { returnRequest } = props;
	return (
		<Card className='rounded-lg shadow-md w-full'>
			<CardHeader>
				<CardTitle>
					{`${investmentDurationWithReturnTypeText(
						returnRequest.investmentDuration,
						returnRequest.returnType
					)} Rolling Returns`}
				</CardTitle>
				<CardDescription>
					{`${rollingReturnTypeText(
						returnRequest.rollingReturnType
					)} for the last ${displayPresetTimeDuration(
						returnRequest.rollingWindow
					)}`}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<RollingReturnsTable {...props} />
			</CardContent>
		</Card>
	);
}

function RollingReturnsTable(props: {
	instrumentType: InstrumentType;
	instruments: Instrument[];
	returnRequest: ReturnRequest;
}) {
	const { instruments, returnRequest } = props;

	if (instruments.length === 0) {
		return (
			<div className='flex items-center justify-center'>
				<Label>{`No ${instrumentTypeText(
					props.instrumentType
				)} selected`}</Label>
			</div>
		);
	}

	return (
		<div className='overflow-x-auto'>
			<Table className='w-full'>
				<TableHeader>
					<TableRow>
						<TableHead className='whitespace-nowrap'>
							{instrumentTypeText(props.instrumentType)}
						</TableHead>
						<TableHead className='text-center'>
							{rollingReturnTypeText(returnRequest.rollingReturnType)}
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{instruments.map((instrument) => (
						<TableRow key={instrument.symbol}>
							<TableCell>{instrument.name}</TableCell>
							<RollingReturnsTableCell
								instrument={instrument}
								returnRequest={returnRequest}
							/>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

function RollingReturnsTableCell(props: {
	instrument: Instrument;
	returnRequest: ReturnRequest;
}) {
	const { returnRequest } = props;
	const rollingReturnsQuery = useRollingReturnsQuery(
		returnRequest,
		props.instrument
	);

	if (rollingReturnsQuery.isFetching) {
		return (
			<TableCell className='text-center'>
				<LoadingComponent loadingMessage='Calculating returns...' />
			</TableCell>
		);
	}

	if (rollingReturnsQuery.isError) {
		return (
			<TableCell className='text-center'>
				<ErrorComponent errorMessage='Error occurred while calculating returns' />
			</TableCell>
		);
	}

	const returns = rollingReturnsQuery.data!;

	if (returns.length === 0) {
		return <TableCell className='text-center'>-</TableCell>;
	}

	const rollingReturnValue = calculateRollingReturns(
		returns,
		returnRequest.rollingReturnType
	);

	return (
		<TableCell
			className={cn(
				rollingReturnValue < 0 ? 'text-red-600' : 'text-green-600',
				'mx-auto w-fit font-semibold text-center'
			)}>
			{rollingReturnValue.toFixed(2)}%
		</TableCell>
	);
}

function calculateRollingReturns(
	returns: number[],
	rollingReturnType: RollingReturnType
) {
	switch (rollingReturnType) {
		case RollingReturnType.Min:
			return Math.min(...returns);
		case RollingReturnType.Max:
			return Math.max(...returns);
		case RollingReturnType.Avg:
			return returns.reduce((sum, r) => sum + r, 0) / returns.length;
		case RollingReturnType.P25:
			return percentile(25, returns) as number;
		case RollingReturnType.P50:
			return percentile(50, returns) as number;
		case RollingReturnType.P75:
			return percentile(75, returns) as number;
		case RollingReturnType.P90:
			return percentile(90, returns) as number;
		default:
			throw new Error(`Unsupported rolling return type: ${rollingReturnType}`);
	}
}
