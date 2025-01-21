import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import '@/app/globals.css';
import Providers from '@/components/Providers';
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-sans',
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={cn(
					'min-h-screen, bg-background font-sans antialiased',
					inter.variable
				)}>
				<Providers>{children}</Providers>
			</body>
			<GoogleAnalytics gaId='G-NL8V8WZQN1' />
		</html>
	);
}
