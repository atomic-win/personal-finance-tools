'use client';

import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';

export function Modal({ children }: { children: React.ReactNode }) {
	const router = useRouter();

	const handleOpenChange = () => {
		router.back();
	};

	return (
		<Dialog defaultOpen={true} open={true} onOpenChange={handleOpenChange}>
			<Card>
				<DialogContent>
					<DialogHeader></DialogHeader>
					{children}
				</DialogContent>
			</Card>
		</Dialog>
	);
}
