import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

export default function A3TableRowsMessage({
	message,
	className,
}: {
	message: string;
	className?: string;
}) {
	return (
		<TableRow>
			<TableCell
				colSpan={15}
				className={cn('text-center text-muted-foreground', className)}
			>
				{message}
			</TableCell>
		</TableRow>
	);
}
