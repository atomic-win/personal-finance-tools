import { MutualFund } from '@/components/hooks/mutualfunds';
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
import { displayPresetTimeDuration } from '@/lib/utils';

export default function AnalysisTable({
	mutualfunds,
}: {
	mutualfunds: MutualFund[];
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
								<TableHead key={mf.schemeCode}>{mf.schemeName}</TableHead>
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
										duration={duration as PresetTimeDurations}
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
	duration,
}: {
	mutualfund: MutualFund;
	duration: PresetTimeDurations;
}) {
	return <TableCell></TableCell>;
}
