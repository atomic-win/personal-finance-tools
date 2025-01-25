'use client';

import { useQuery } from '@tanstack/react-query';

export type IpData = {
	currency: string;
	languages: string[];
};

export function useIpQuery() {
	return useQuery({
		queryKey: ['ip', 'api', 'query'],
		queryFn: async () => {
			const response = await fetch('https://ipapi.co/json/');
			const data = await response.json();
			return {
				currency: data.currency,
				languages: (data.languages as string).split(','),
			};
		},
	});
}
