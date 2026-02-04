import { useRollingReturnsQuery } from '@/features/indian-mutual-funds-analysis/hooks/mutualfunds';
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
	MutualFund,
	ReturnRequest,
	RollingReturnType,
} from '@/features/indian-mutual-funds-analysis/lib/types';
import { cn } from '@/lib/utils';
import {
	displayPresetTimeDuration,
	investmentDurationWithReturnTypeText,
	rollingReturnTypeText,
} from '@/features/indian-mutual-funds-analysis/lib/utils';
import LoadingComponent from '@/components/loading-component';
import ErrorComponent from '@/components/error-component';
import percentile from 'percentile';

export default function RollingReturnsTableCard(
	props: {
		mutualfunds: MutualFund[];
	} & ReturnRequest,
) {
	return (
		<Card className='rounded-lg shadow-md w-full'>
			<CardHeader>
				<CardTitle>
					{`${investmentDurationWithReturnTypeText(
						props.investmentDuration,
						props.returnType,
					)} Rolling Returns`}
				</CardTitle>
				<CardDescription>
					{`${rollingReturnTypeText(
						props.rollingReturnType,
					)} for the last ${displayPresetTimeDuration(props.rollingWindow)}`}
				</CardDescription>
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
	} & ReturnRequest,
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
		<div className='overflow-x-auto'>
			<Table className='w-full'>
				<TableHeader>
					<TableRow>
						<TableHead className='whitespace-nowrap'>
							Mutual Fund
						</TableHead>
						<TableHead className='text-center'>
							{rollingReturnTypeText(props.rollingReturnType)}
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{mutualfunds.map((mf) => (
						<TableRow key={mf.schemeCode}>
							<TableCell>{mf.schemeName}</TableCell>
							<RollingReturnsTableCell
								{...props}
								mutualfund={mf}
							/>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

function RollingReturnsTableCell(
	props: {
		mutualfund: MutualFund;
	} & ReturnRequest,
) {
	const rollingReturnsQuery = useRollingReturnsQuery(props);

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
		props.rollingReturnType,
	);

	return (
		<TableCell
			className={cn(
				rollingReturnValue < 0 ? 'text-red-600' : 'text-green-600',
				'mx-auto w-fit font-semibold text-center',
			)}
		>
			{rollingReturnValue.toFixed(2)}%
		</TableCell>
	);
}

function calculateRollingReturns(
	returns: number[],
	rollingReturnType: RollingReturnType,
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
			throw new Error(
				`Unsupported rolling return type: ${rollingReturnType}`,
			);
	}
}
