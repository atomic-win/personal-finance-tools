'use client';

import { useQuery } from '@tanstack/react-query';

export type IpData = {
	currency: string;
	languages: string[];
};

const DEFAULT_IP_DATA: IpData = {
	currency: 'USD',
	languages: ['en-US'],
};

export function useIpQuery() {
	return useQuery({
		queryKey: ['ip', 'api', 'query'],
		queryFn: async () => {
			try {
				const response = await fetch('https://ipapi.co/json/');
				if (!response.ok) {
					console.error(
						'Failed to fetch ip data from ipapi.co',
						response.statusText
					);

					return DEFAULT_IP_DATA;
				}

				const data = await response.json();
				return {
					currency: data.currency || DEFAULT_IP_DATA.currency,
					languages: ((data.languages || '') as string).split(','),
				};
			} catch (error) {
				console.error('Error fetching ip data:', error);
				return DEFAULT_IP_DATA;
			}
		},
	});
}
