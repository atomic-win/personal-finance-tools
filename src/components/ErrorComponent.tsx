import { Label } from '@/components/ui/label';

export default function ErrorComponent({
	errorMessage,
}: {
	errorMessage: string;
}) {
	return (
		<div className='flex items-center justify-center'>
			<Label>{errorMessage}</Label>
		</div>
	);
}
