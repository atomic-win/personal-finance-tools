import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
	const BASE_URL = 'https://personal-finance-tools.azurewebsites.net';
	return [
		{
			url: BASE_URL,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.5,
		},
		{
			url: `${BASE_URL}/calculators/fixed-deposit`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1,
		},
		{
			url: `${BASE_URL}/calculators/recurring-deposit`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1,
		},
		{
			url: `${BASE_URL}/calculators/sip`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1,
		},
		{
			url: `${BASE_URL}/calculators/swp`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1,
		},
		{
			url: `${BASE_URL}/calculators/sip-swp`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1,
		},
		{
			url: `${BASE_URL}/indian-mutual-funds-analysis/rolling-returns`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1,
		},
		{
			url: `${BASE_URL}/indian-mutual-funds-analysis/sip`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1,
		},
		{
			url: `${BASE_URL}/indian-mutual-funds-analysis/swp`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1,
		},
	];
}
