'use client';

import { useRouter } from 'next/navigation';
import { Dialog } from '@/components/ui/dialog';

export function Modal({ children }: { children: React.ReactNode }) {
	const router = useRouter();

	const handleOpenChange = () => {
		router.back();
	};

	return (
		<Dialog defaultOpen={true} open={true} onOpenChange={handleOpenChange}>
			{children}
		</Dialog>
	);
}
