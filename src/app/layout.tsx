import { Header } from '@/components/header';
import { AuthProvider } from '@/contexts/auth-context';
import { Toaster } from '@/shared/components/toaster';
import '@/styles/globals.css';
import '@/styles/theme.css';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Habbit - Track Your Daily Habits',
    description: 'A simple habit tracking app to help you build better habits',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-[var(--background-primary)] text-[var(--text-primary)]`}>
                <AuthProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem={false}
                        disableTransitionOnChange>
                        <Toaster />
                        <Header />
                        <main className="flex-1">{children}</main>
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
