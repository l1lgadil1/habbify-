'use client';

import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import { useToast } from '@/shared/hooks/use-toast';
import { Habit, HabitStatus } from '@/shared/types/habit.types';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CalendarView } from './components/calendar-view';
import { HabitForm } from './components/habit-form';

export default function DashboardPage() {
    const router = useRouter();
    const { user, loading, signOut } = useAuth();
    const [habits, setHabits] = useState<Habit[]>([]);
    const [view, setView] = useState<'calendar' | 'list'>('calendar');
    const { toast } = useToast();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/sign-in');
        }
    }, [loading, user, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const handleAddHabit = (
        habitData: Omit<Habit, 'id' | 'progress' | 'createdAt' | 'updatedAt'>,
    ) => {
        const newHabit: Habit = {
            ...habitData,
            id: crypto.randomUUID(),
            progress: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        setHabits((prev) => [...prev, newHabit]);
        toast({
            title: 'Success!',
            description: `Habit "${habitData.name}" has been created.`,
        });
    };

    const handleUpdateHabit = (updatedHabit: Habit) => {
        setHabits((prev) =>
            prev.map((habit) =>
                habit.id === updatedHabit.id
                    ? { ...updatedHabit, updatedAt: new Date().toISOString() }
                    : habit,
            ),
        );
        toast({
            title: 'Success!',
            description: `Habit "${updatedHabit.name}" has been updated.`,
        });
    };

    const handleDeleteHabit = (habitId: string) => {
        setHabits((prev) => prev.filter((habit) => habit.id !== habitId));
    };

    const handleUpdateProgress = (habitId: string, date: string, status: HabitStatus) => {
        setHabits((prev) =>
            prev.map((habit) => {
                if (habit.id !== habitId) return habit;

                const existingProgressIndex = habit.progress.findIndex((p) => p.date === date);
                const newProgress = [...habit.progress];

                if (existingProgressIndex !== -1) {
                    if (status === null) {
                        // Remove the progress entry if status is null
                        newProgress.splice(existingProgressIndex, 1);
                    } else {
                        // Update existing progress
                        newProgress[existingProgressIndex] = { date, status };
                    }
                } else if (status !== null) {
                    // Add new progress entry
                    newProgress.push({ date, status });
                }

                return {
                    ...habit,
                    progress: newProgress,
                    updatedAt: new Date().toISOString(),
                };
            }),
        );
    };

    const calculateCompletionRate = () => {
        if (habits.length === 0) return 0;
        const last7Days = habits.flatMap((habit) =>
            habit.progress.filter((p) => {
                const date = new Date(p.date);
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                return date >= sevenDaysAgo;
            }),
        );

        if (last7Days.length === 0) return 0;
        const completed = last7Days.filter((p) => p.status === 'completed').length;
        return Math.round((completed / last7Days.length) * 100);
    };

    const calculateStreak = () => {
        if (habits.length === 0) return 0;
        let streak = 0;
        const today = new Date();
        const allProgress = habits.flatMap((habit) => habit.progress);

        for (let i = 0; i < 365; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayProgress = allProgress.filter((p) => p.date === dateStr);
            if (dayProgress.length === 0 || dayProgress.some((p) => p.status !== 'completed')) {
                break;
            }
            streak++;
        }
        return streak;
    };

    const getMostConsistentHabit = () => {
        if (habits.length === 0) return null;

        return habits.reduce((mostConsistent, current) => {
            const currentCompleted = current.progress.filter(
                (p) => p.status === 'completed',
            ).length;
            const mostCompletedCount = mostConsistent.progress.filter(
                (p) => p.status === 'completed',
            ).length;

            return currentCompleted > mostCompletedCount ? current : mostConsistent;
        }, habits[0]);
    };

    const mostConsistentHabit = getMostConsistentHabit();

    return (
        <main className="container mx-auto p-4 md:p-8 bg-[var(--background-primary)]">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
                        My Habits
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-2 text-base">
                        Track and manage your daily habits
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={signOut}
                    className="h-10 w-10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-surface-hover)]">
                    <LogOut className="h-5 w-5" />
                </Button>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
                <Button
                    variant={view === 'calendar' ? 'default' : 'outline'}
                    onClick={() => setView('calendar')}
                    className={cn(
                        'flex-1 h-10 min-w-[140px] font-medium transition-all',
                        view === 'calendar' &&
                            'bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)]',
                    )}>
                    Calendar View
                </Button>
                <Button
                    variant={view === 'list' ? 'default' : 'outline'}
                    onClick={() => setView('list')}
                    className={cn(
                        'flex-1 h-10 min-w-[140px] font-medium transition-all',
                        view === 'list' &&
                            'bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)]',
                    )}>
                    List View
                </Button>
                <HabitForm onSubmit={handleAddHabit} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <Card className="col-span-1 hover:shadow-lg transition-shadow bg-[var(--background-card)] border-[var(--border-primary)]">
                    <CardHeader className="p-5">
                        <CardTitle className="text-base font-semibold text-[var(--text-primary)]">
                            Total Habits
                        </CardTitle>
                        <CardDescription className="text-xs text-[var(--text-secondary)]">
                            Active habits
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 pt-0">
                        <p className="text-3xl font-bold text-[var(--brand-primary)]">
                            {habits.filter((h) => !h.isArchived).length}
                        </p>
                    </CardContent>
                </Card>
                <Card className="col-span-1 hover:shadow-lg transition-shadow bg-[var(--background-card)] border-[var(--border-primary)]">
                    <CardHeader className="p-5">
                        <CardTitle className="text-base font-semibold text-[var(--text-primary)]">
                            Completion Rate
                        </CardTitle>
                        <CardDescription className="text-xs text-[var(--text-secondary)]">
                            Last 7 days
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 pt-0">
                        <p className="text-3xl font-bold text-[var(--status-success)]">
                            {calculateCompletionRate()}%
                        </p>
                    </CardContent>
                </Card>
                <Card className="col-span-1 hover:shadow-lg transition-shadow bg-[var(--background-card)] border-[var(--border-primary)]">
                    <CardHeader className="p-5">
                        <CardTitle className="text-base font-semibold text-[var(--text-primary)]">
                            Streak
                        </CardTitle>
                        <CardDescription className="text-xs text-[var(--text-secondary)]">
                            Current streak
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 pt-0">
                        <p className="text-3xl font-bold text-[var(--status-warning)]">
                            {calculateStreak()}
                        </p>
                    </CardContent>
                </Card>
                <Card className="col-span-1 hover:shadow-lg transition-shadow bg-[var(--background-card)] border-[var(--border-primary)]">
                    <CardHeader className="p-5">
                        <CardTitle className="text-base font-semibold text-[var(--text-primary)]">
                            Most Consistent
                        </CardTitle>
                        <CardDescription className="text-xs text-[var(--text-secondary)]">
                            Best habit
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 pt-0">
                        {mostConsistentHabit ? (
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{mostConsistentHabit.icon}</span>
                                <span className="text-base font-medium truncate text-[var(--brand-primary)]">
                                    {mostConsistentHabit.name}
                                </span>
                            </div>
                        ) : (
                            <p className="text-sm text-[var(--text-secondary)]">No habits yet</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="bg-[var(--background-card)] rounded-xl shadow-sm hover:shadow-md transition-shadow border border-[var(--border-primary)]">
                {view === 'calendar' ? (
                    <CalendarView
                        habits={habits}
                        onUpdateProgress={handleUpdateProgress}
                        onUpdateHabit={handleUpdateHabit}
                        onDeleteHabit={handleDeleteHabit}
                    />
                ) : (
                    <div className="space-y-4 p-6">
                        {habits.length === 0 ? (
                            <div className="text-center py-12">
                                <h3 className="text-lg font-medium text-[var(--text-secondary)]">
                                    No habits yet
                                </h3>
                                <p className="text-base text-[var(--text-secondary)] mt-2">
                                    Start by adding your first habit!
                                </p>
                            </div>
                        ) : (
                            habits.map((habit) => (
                                <Card
                                    key={habit.id}
                                    className="hover:shadow-md transition-shadow bg-[var(--background-card)] border-[var(--border-primary)]">
                                    <CardHeader className="p-5">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className="text-2xl flex-shrink-0">
                                                    {habit.icon}
                                                </span>
                                                <div className="min-w-0">
                                                    <CardTitle className="text-lg text-[var(--text-primary)] truncate">
                                                        {habit.name}
                                                    </CardTitle>
                                                    {habit.description && (
                                                        <CardDescription className="text-sm text-[var(--text-secondary)] truncate mt-1">
                                                            {habit.description}
                                                        </CardDescription>
                                                    )}
                                                </div>
                                            </div>
                                            <Badge
                                                variant={
                                                    habit.frequency === 'daily'
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                                className="flex-shrink-0 px-3 py-1 font-medium bg-[var(--brand-primary-light)] text-[var(--brand-primary)]">
                                                {habit.frequency}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-5 pt-0">
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {habit.progress.slice(-5).map((p, index) => (
                                                <div
                                                    key={index}
                                                    className={cn(
                                                        'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-medium transition-colors',
                                                        p.status === 'completed' &&
                                                            'bg-[var(--calendar-completed)] text-[var(--calendar-completed-text)]',
                                                        p.status === 'failed' &&
                                                            'bg-[var(--calendar-failed)] text-[var(--calendar-failed-text)]',
                                                        p.status === 'skipped' &&
                                                            'bg-[var(--calendar-skipped)] text-[var(--calendar-skipped-text)]',
                                                    )}>
                                                    {p.status === 'completed'
                                                        ? '✓'
                                                        : p.status === 'failed'
                                                        ? '×'
                                                        : '-'}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
