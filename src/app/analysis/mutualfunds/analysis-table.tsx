import {
	MutualFund,
	MutualFundAnalysis,
	useXIRRQuery,
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

export default function AnalysisTable({
	mutualfunds,
	lumpsumAmount,
	monthlyInvestment,
	annualStepUpPercent,
	investmentDuration,
}: {
	mutualfunds: MutualFund[];
	lumpsumAmount: number;
	monthlyInvestment: number;
	annualStepUpPercent: number;
	investmentDuration: PresetTimeDurations;
}) {
	if (!mutualfunds.length) {
		return null;
	}

	return (
		<Card className='mx-auto my-2 p-2 rounded-lg shadow-md w-full col-span-2'>
			<CardHeader>
				<CardTitle>XIRR Analysis Table</CardTitle>
			</CardHeader>
			<CardContent>
				<Table className='w-full'>
					<TableHeader>
						<TableRow>
							<TableHead></TableHead>
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
									<AnalysisTableCell
										key={mf.schemeCode}
										mutualfund={mf}
										lumpsumAmount={lumpsumAmount}
										monthlyInvestment={monthlyInvestment}
										annualStepUpPercent={annualStepUpPercent}
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

function AnalysisTableCell({
	mutualfund,
	lumpsumAmount,
	monthlyInvestment,
	annualStepUpPercent,
	investmentDuration,
	lookback,
}: {
	mutualfund: MutualFund;
	lumpsumAmount: number;
	monthlyInvestment: number;
	annualStepUpPercent: number;
	investmentDuration: PresetTimeDurations;
	lookback: PresetTimeDurations;
}) {
	const anaysis: MutualFundAnalysis = useXIRRQuery(
		mutualfund,
		lumpsumAmount,
		monthlyInvestment,
		annualStepUpPercent,
		investmentDuration,
		lookback
	);

	if (anaysis.isPending) {
		return <TableCell className='text-center'>Loading...</TableCell>;
	}

	if (!anaysis.isPending && anaysis.minXirr === Infinity) {
		return <TableCell className='text-center'>-</TableCell>;
	}

	return (
		<TableCell>
			<div className='mx-auto w-fit'>
				<XIRRValue label='Mean' value={anaysis.meanXirr} />
				<XIRRValue label='Min' value={anaysis.minXirr} />
				<XIRRValue label='Max' value={anaysis.maxXirr} />
			</div>
		</TableCell>
	);
}

function XIRRValue({ label, value }: { label: string; value: number }) {
	return (
		<div className='font-semibold'>
			<text>{label}: </text>
			<text className={cn(value < 0 ? 'text-red-500' : 'text-green-500')}>
				{value.toFixed(2)}%
			</text>
		</div>
	);
}
