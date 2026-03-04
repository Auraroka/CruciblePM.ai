import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Project Control Tower',
    description: 'AI-native visual project management platform',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
