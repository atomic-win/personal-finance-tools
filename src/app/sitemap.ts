import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
	// biome-ignore lint/style/noNonNullAssertion: We are sure that the environment variable will always be available as we have set it up in our deployment environment and it is required for the application to function correctly.
	const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;
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
			url: `${BASE_URL}/indian-mutual-funds-analysis/cagr`,
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
