import { useNavigate, useSearch } from '@tanstack/react-router';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSearchParamValues } from '@/features/investment-analysis/hoc/with-instruments';
import { SUPPORTED_INDEXES } from '@/features/investment-analysis/lib/indexes';
import { cn } from '@/lib/utils';

export default function SelectIndexesCard() {
	const search = useSearch({ strict: false }) as Record<
		string,
		string | string[]
	>;
	const navigate = useNavigate();

	const selectedSymbols = getSearchParamValues(search, 'indexSymbol');

	function toggleIndex(symbol: string) {
		const updatedSymbols = selectedSymbols.includes(symbol)
			? selectedSymbols.filter((x) => x !== symbol)
			: [...selectedSymbols, symbol];

		navigate({
			search: {
				...search,
				indexSymbol: updatedSymbols.length > 0 ? updatedSymbols : undefined,
			} as Record<string, string | string[] | undefined>,
			replace: true,
		});
	}

	return (
		<Card className='rounded-lg shadow-md w-full'>
			<CardHeader>
				<CardTitle>Indexes</CardTitle>
			</CardHeader>
			<CardContent className='space-y-2'>
				{SUPPORTED_INDEXES.map((index) => {
					const isSelected = selectedSymbols.includes(index.symbol);

					return (
						<Button
							key={index.symbol}
							type='button'
							variant={isSelected ? 'default' : 'outline'}
							onClick={() => toggleIndex(index.symbol)}
							className='w-full justify-start cursor-pointer'
						>
							<Check
								className={cn('mr-2 h-4 w-4', !isSelected && 'opacity-0')}
							/>
							{index.name}
						</Button>
					);
				})}
			</CardContent>
		</Card>
	);
}
