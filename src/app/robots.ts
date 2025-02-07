import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: '/investments/',
		},
		sitemap: 'https://personal-finance-tools.azurewebsites.net/sitemap.xml',
	};
}
