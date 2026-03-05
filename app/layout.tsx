import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Project Control Tower',
    description: 'AI-native visual project management platform',
};

import { ThemeProvider } from '@/components/theme-provider';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
