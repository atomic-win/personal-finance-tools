import percentile from 'percentile';
import ErrorComponent from '@/components/error-component';
import LoadingComponent from '@/components/loading-component';
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
import { withMutualFunds } from '@/features/indian-mutual-funds-analysis/hoc/with-mutual-funds';
import { useRollingReturnsQuery } from '@/features/indian-mutual-funds-analysis/hooks/mutualfunds';
import {
	type MutualFund,
	type ReturnRequest,
	RollingReturnType,
} from '@/features/indian-mutual-funds-analysis/lib/types';
import {
	displayPresetTimeDuration,
	investmentDurationWithReturnTypeText,
	rollingReturnTypeText,
} from '@/features/indian-mutual-funds-analysis/lib/utils';
import { cn } from '@/lib/utils';

const LoadedRollingReturnsTable = withMutualFunds(RollingReturnsTable);

export default function RollingReturnsTableCard({
	returnRequest,
}: {
	returnRequest: ReturnRequest;
}) {
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
					)} for the last ${displayPresetTimeDuration(returnRequest.rollingWindow)}`}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<LoadedRollingReturnsTable returnRequest={returnRequest} />
			</CardContent>
		</Card>
	);
}

function RollingReturnsTable({
	mutualfunds,
	returnRequest,
}: {
	mutualfunds: MutualFund[];
	returnRequest: ReturnRequest;
}) {
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
						<TableHead className='whitespace-nowrap'>Mutual Fund</TableHead>
						<TableHead className='text-center'>
							{rollingReturnTypeText(returnRequest.rollingReturnType)}
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{mutualfunds.map((mf) => (
						<TableRow key={mf.schemeCode}>
							<TableCell>{mf.schemeName}</TableCell>
							<RollingReturnsTableCell
								returnRequest={returnRequest}
								mutualfund={mf}
							/>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

function RollingReturnsTableCell({
	mutualfund,
	returnRequest,
}: {
	mutualfund: MutualFund;
	returnRequest: ReturnRequest;
}) {
	const rollingReturnsQuery = useRollingReturnsQuery(returnRequest, mutualfund);

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

	// biome-ignore lint/style/noNonNullAssertion: We are sure that the data will always be available as we are checking for loading and error states above.
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
			)}
		>
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
