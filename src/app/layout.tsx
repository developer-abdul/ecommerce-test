import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import '@ant-design/v5-patch-for-react-19';
import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<AntdRegistry>
					<Providers>{children}</Providers>
				</AntdRegistry>
			</body>
		</html>
	);
}
