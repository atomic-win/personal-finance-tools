import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

export default function LoadingComponent({
	loadingMessage,
}: {
	loadingMessage: string;
}) {
	return (
		<div className='flex items-center justify-center'>
			<Spinner className='mr-2' />
			<Label>{loadingMessage}</Label>
		</div>
	);
}
