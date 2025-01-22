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
				<footer className="mt-8 p-4 bg-gray-100 text-center">
					<a
						href="https://forms.gle/hkvX3nzQcsBVn4xp7"
						className="text-blue-500 hover:underline"
					>
						Feedback
					</a>
				</footer>
			</body>
			<GoogleAnalytics gaId='G-NL8V8WZQN1' />
		</html>
	);
}
