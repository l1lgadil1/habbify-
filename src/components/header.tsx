'use client';

import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { BarChart3, Calendar, LogOut, Settings, Target, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: Calendar,
    },
    {
        name: 'Analytics',
        href: '/analytics',
        icon: BarChart3,
    },
    {
        name: 'Goals',
        href: '/goals',
        icon: Target,
    },
    {
        name: 'Settings',
        href: '/settings',
        icon: Settings,
    },
];

export function Header() {
    const { user, signOut } = useAuth();
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-sm bg-[var(--background-primary)]/80 border-b border-[var(--border-primary)] shadow-sm">
            <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] flex items-center justify-center">
                            <span className="text-white font-bold text-lg">H</span>
                        </div>
                        <span className="font-bold text-xl bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)] bg-clip-text text-transparent">
                            Habbit
                        </span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
                                        pathname === item.href
                                            ? 'bg-[var(--brand-primary-light)] text-[var(--brand-primary)]'
                                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-surface-hover)]',
                                    )}>
                                    <Icon className="h-4 w-4" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="hidden md:block text-sm text-[var(--text-secondary)]">
                                Welcome back!
                            </span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                                        <div className="w-full h-full rounded-lg bg-[var(--brand-primary-light)] flex items-center justify-center">
                                            <User className="h-4 w-4 text-[var(--brand-primary)]" />
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuItem className="flex-col items-start p-3">
                                        <div className="text-sm font-medium text-[var(--text-primary)]">
                                            {user.email}
                                        </div>
                                        <div className="text-xs text-[var(--text-secondary)]">
                                            Signed in
                                        </div>
                                    </DropdownMenuItem>
                                    {/* Mobile Navigation */}
                                    <div className="md:hidden border-t border-[var(--border-primary)] my-1">
                                        {navigation.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <Link key={item.name} href={item.href}>
                                                    <DropdownMenuItem className="p-3 gap-2">
                                                        <Icon className="h-4 w-4" />
                                                        {item.name}
                                                    </DropdownMenuItem>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                    <DropdownMenuItem
                                        className="p-3 text-[var(--status-error)] focus:text-[var(--status-error)] focus:bg-[var(--status-error-light)] cursor-pointer gap-2 border-t border-[var(--border-primary)]"
                                        onClick={signOut}>
                                        <LogOut className="h-4 w-4" />
                                        Sign out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/auth/sign-in">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                                    Sign in
                                </Button>
                            </Link>
                            <Link href="/auth/sign-up">
                                <Button
                                    size="sm"
                                    className="bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)]">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
