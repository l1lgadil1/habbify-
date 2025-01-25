import { Header } from '@/components/header';
import { AuthProvider } from '@/contexts/auth-context';
import { Toaster } from '@/shared/components/toaster';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

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
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
                <AuthProvider>
                    <Header />
                    <main className="flex-1">{children}</main>
                    <Toaster />
                </AuthProvider>
            </body>
        </html>
    );
}
