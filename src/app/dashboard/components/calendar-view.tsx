'use client';

import { cn } from '@/lib/utils';
import { useToast } from '@/shared/hooks/use-toast';
import { Habit, HabitStatus } from '@/shared/types/habit.types';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/shared/ui/alert-dialog';
import { Button } from '@/shared/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/ui/sheet';
import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    format,
    isSameDay,
    startOfMonth,
    subMonths,
} from 'date-fns';
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    ListTodo,
    Menu,
    Pencil,
    Trash2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { HabitForm } from './habit-form';

interface CalendarViewProps {
    habits: Habit[];
    onUpdateProgress: (habitId: string, date: string, status: HabitStatus) => void;
    onUpdateHabit: (habit: Habit) => void;
    onDeleteHabit: (habitId: string) => void;
}

function EmptyState({ view }: { view: 'calendar' | 'list' }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            {view === 'calendar' ? (
                <CalendarDays className="h-16 w-16 text-[var(--brand-primary)] mb-6" />
            ) : (
                <ListTodo className="h-16 w-16 text-[var(--brand-primary)] mb-6" />
            )}
            <h3 className="text-xl font-medium text-[var(--text-primary)] text-center mb-2">
                No habits tracked yet
            </h3>
            <p className="text-base text-[var(--text-secondary)] text-center max-w-[400px] mb-8">
                Start building better habits today! Click the &quot;Add Habit&quot; button above to
                begin your journey.
            </p>
            <div className="space-y-4 text-base text-[var(--text-primary)] bg-[var(--background-surface)] p-6 rounded-lg shadow-md w-full max-w-[400px] border border-[var(--border-primary)]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--brand-primary-light)] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[var(--brand-primary)]" />
                    </div>
                    <span>Track daily, weekly, or monthly habits</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--brand-primary-light)] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[var(--brand-primary)]" />
                    </div>
                    <span>Set goals and monitor your progress</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--brand-primary-light)] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[var(--brand-primary)]" />
                    </div>
                    <span>Build streaks and stay motivated</span>
                </div>
            </div>
        </div>
    );
}

export function CalendarView({
    habits,
    onUpdateProgress,
    onUpdateHabit,
    onDeleteHabit,
}: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
    const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const [isMobileView, setIsMobileView] = useState(false);

    const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    // Scroll to current day when component mounts or month changes
    useEffect(() => {
        if (scrollContainerRef.current) {
            const today = new Date();
            const currentDayCell = scrollContainerRef.current.querySelector(
                `[data-date="${format(today, 'yyyy-MM-dd')}"]`,
            );

            if (currentDayCell) {
                const containerWidth = scrollContainerRef.current.clientWidth;
                const cellRect = currentDayCell.getBoundingClientRect();
                const containerRect = scrollContainerRef.current.getBoundingClientRect();
                const scrollLeft =
                    cellRect.left - containerRect.left - containerWidth / 2 + cellRect.width / 2;

                scrollContainerRef.current.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth',
                });
            }
        }
    }, [currentDate]);

    useEffect(() => {
        const checkMobileView = () => {
            setIsMobileView(window.innerWidth < 768);
        };
        checkMobileView();
        window.addEventListener('resize', checkMobileView);
        return () => window.removeEventListener('resize', checkMobileView);
    }, []);

    const getHabitStatusForDate = (habit: Habit, date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return habit.progress.find((p) => p.date === dateStr)?.status || null;
    };

    const handleStatusToggle = (habit: Habit, date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const currentStatus = getHabitStatusForDate(habit, date);
        let newStatus: HabitStatus;

        switch (currentStatus) {
            case null:
                newStatus = 'completed';
                break;
            case 'completed':
                newStatus = 'failed';
                break;
            case 'failed':
                newStatus = 'skipped';
                break;
            default:
                newStatus = null;
                break;
        }

        onUpdateProgress(habit.id, dateStr, newStatus);
    };

    const handleUpdateHabit = (
        habitData: Omit<Habit, 'id' | 'progress' | 'createdAt' | 'updatedAt'>,
    ) => {
        if (!habitToEdit) return;

        onUpdateHabit({
            ...habitData,
            id: habitToEdit.id,
            progress: habitToEdit.progress,
            createdAt: habitToEdit.createdAt,
            updatedAt: new Date().toISOString(),
        });
        setHabitToEdit(null);
    };

    const handleDeleteConfirm = () => {
        if (habitToDelete) {
            onDeleteHabit(habitToDelete.id);
            toast({
                title: 'Habit Deleted',
                description: `${habitToDelete.name} has been deleted.`,
            });
            setHabitToDelete(null);
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between p-6 bg-[var(--background-surface)] shadow-md mb-6 rounded-lg border border-[var(--border-primary)]">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-surface-hover)]"
                        onClick={handlePreviousMonth}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <h2 className="text-lg font-medium text-[var(--text-primary)]">
                        {format(currentDate, 'MMMM yyyy')}
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-surface-hover)]"
                        onClick={handleNextMonth}>
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {habits.length === 0 ? (
                <div className="bg-[var(--background-card)] rounded-lg shadow-md border border-[var(--border-primary)]">
                    <EmptyState view={isMobileView ? 'list' : 'calendar'} />
                </div>
            ) : isMobileView ? (
                <div className="space-y-4 px-6 pb-6">
                    {habits.map((habit) => (
                        <div
                            key={habit.id}
                            className="bg-[var(--background-card)] rounded-lg shadow-md p-6 border border-[var(--border-primary)] hover:border-[var(--border-hover)] transition-colors">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[var(--brand-primary-light)] flex items-center justify-center text-2xl">
                                        {habit.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-1">
                                            {habit.name}
                                        </h3>
                                        <p className="text-sm text-[var(--text-secondary)]">
                                            Goal: {habit.goal} days
                                        </p>
                                    </div>
                                </div>
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-surface-hover)]">
                                            <Menu className="h-5 w-5" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent
                                        side="right"
                                        className="w-[320px] bg-[var(--background-card)] border-[var(--border-primary)]">
                                        <SheetHeader>
                                            <SheetTitle className="text-[var(--text-primary)] text-xl">
                                                Actions
                                            </SheetTitle>
                                        </SheetHeader>
                                        <div className="flex flex-col gap-2 mt-6">
                                            <HabitForm
                                                initialData={habit}
                                                onSubmit={handleUpdateHabit}
                                                trigger={
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start h-12 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-surface-hover)] rounded-lg"
                                                        onClick={() => setHabitToEdit(habit)}>
                                                        <Pencil className="h-5 w-5 mr-3" />
                                                        Edit Habit
                                                    </Button>
                                                }
                                            />
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start h-12 text-[var(--status-error)] hover:text-[var(--status-error)] hover:bg-[var(--status-error-light)] rounded-lg"
                                                onClick={() => setHabitToDelete(habit)}>
                                                <Trash2 className="h-5 w-5 mr-3" />
                                                Delete Habit
                                            </Button>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>

                            <div className="grid grid-cols-7 gap-2 mb-6">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                    <div
                                        key={day}
                                        className="text-center text-xs text-[var(--text-secondary)] font-medium">
                                        {day[0]}
                                    </div>
                                ))}

                                {Array.from({ length: new Date(monthStart).getDay() }).map(
                                    (_, index) => (
                                        <div key={`empty-${index}`} className="aspect-square" />
                                    ),
                                )}

                                {daysInMonth.map((day) => {
                                    const status = getHabitStatusForDate(habit, day);
                                    const isToday = isSameDay(day, new Date());
                                    return (
                                        <button
                                            key={day.toString()}
                                            onClick={() => handleStatusToggle(habit, day)}
                                            className={cn(
                                                'aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all text-sm',
                                                isToday &&
                                                    'ring-2 ring-[var(--brand-primary)] ring-offset-2',
                                                status === 'completed' &&
                                                    'bg-[var(--calendar-completed)] text-[var(--calendar-completed-text)]',
                                                status === 'failed' &&
                                                    'bg-[var(--calendar-failed)] text-[var(--calendar-failed-text)]',
                                                status === 'skipped' &&
                                                    'bg-[var(--calendar-skipped)] text-[var(--calendar-skipped-text)]',
                                                !status &&
                                                    'bg-[var(--background-surface)] text-[var(--text-secondary)] hover:bg-[var(--background-surface-hover)]',
                                            )}>
                                            <span className="font-medium mb-1">
                                                {format(day, 'd')}
                                            </span>
                                            <span className="text-xs">
                                                {status === 'completed' && '✓'}
                                                {status === 'failed' && '×'}
                                                {status === 'skipped' && '-'}
                                                {!status && '○'}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex justify-between items-center text-sm text-[var(--text-secondary)] border-t border-[var(--border-primary)] pt-4">
                                <span>
                                    Done:{' '}
                                    {habit.progress.filter((p) => p.status === 'completed').length}
                                </span>
                                <span>Goal: {habit.goal}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="relative overflow-x-auto scrollbar-hide" ref={scrollContainerRef}>
                    <div className="w-full" style={{ minWidth: '1200px' }}>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="text-left p-5 border-b font-medium text-muted-foreground sticky left-0 bg-background z-20 min-w-[200px]">
                                        Habits
                                    </th>
                                    <th
                                        className="sticky left-[200px] bg-background z-20 border-b"
                                        style={{ width: '1px' }}></th>
                                    {daysInMonth.map((day) => (
                                        <th
                                            key={day.toString()}
                                            className="p-3 border-b text-center min-w-[44px] font-medium text-muted-foreground"
                                            data-date={format(day, 'yyyy-MM-dd')}>
                                            <div className="text-sm">{format(day, 'd')}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {format(day, 'E')}
                                            </div>
                                        </th>
                                    ))}
                                    <th className="sticky right-[200px] bg-background z-20 border-b text-center font-medium text-muted-foreground min-w-[100px] p-3">
                                        Actions
                                    </th>
                                    <th className="sticky right-[100px] bg-background z-20 border-b text-center font-medium text-muted-foreground min-w-[100px] p-3">
                                        Goal
                                    </th>
                                    <th className="sticky right-0 bg-background z-20 border-b text-center font-medium text-muted-foreground min-w-[100px] p-3">
                                        Achieved
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {habits.map((habit) => {
                                    const completedCount = habit.progress.filter(
                                        (p) => p.status === 'completed',
                                    ).length;

                                    return (
                                        <tr
                                            key={habit.id}
                                            className="border-b group hover:bg-muted/50 transition-colors">
                                            <td className="p-5 sticky left-0 bg-background group-hover:bg-muted/50 transition-colors z-10">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{habit.icon}</span>
                                                    <span className="font-medium">
                                                        {habit.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td
                                                className="sticky left-[200px] bg-background group-hover:bg-muted/50 transition-colors z-10"
                                                style={{ width: '1px' }}></td>
                                            {daysInMonth.map((day) => {
                                                const status = getHabitStatusForDate(habit, day);
                                                const isToday =
                                                    format(day, 'yyyy-MM-dd') ===
                                                    format(new Date(), 'yyyy-MM-dd');
                                                return (
                                                    <td
                                                        key={day.toString()}
                                                        className="p-3 text-center"
                                                        data-date={format(day, 'yyyy-MM-dd')}>
                                                        <button
                                                            onClick={() =>
                                                                handleStatusToggle(habit, day)
                                                            }
                                                            className={cn(
                                                                'w-8 h-8 rounded-lg flex items-center justify-center text-sm cursor-pointer transition-all',
                                                                isToday &&
                                                                    'ring-2 ring-primary ring-offset-2',
                                                                status === 'completed' &&
                                                                    'bg-green-100 text-green-800 hover:bg-green-200',
                                                                status === 'failed' &&
                                                                    'bg-red-100 text-red-800 hover:bg-red-200',
                                                                status === 'skipped' &&
                                                                    'bg-gray-100 text-gray-800 hover:bg-gray-200',
                                                                !status &&
                                                                    'bg-secondary/40 text-secondary-foreground hover:bg-secondary',
                                                            )}>
                                                            {status === 'completed' && '✓'}
                                                            {status === 'failed' && '×'}
                                                            {status === 'skipped' && '-'}
                                                            {!status && '○'}
                                                        </button>
                                                    </td>
                                                );
                                            })}
                                            <td className="p-3 text-center sticky right-[200px] bg-background group-hover:bg-muted/50 transition-colors z-10">
                                                <div className="flex items-center justify-center gap-2">
                                                    <HabitForm
                                                        initialData={habit}
                                                        onSubmit={handleUpdateHabit}
                                                        trigger={
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 rounded-lg"
                                                                onClick={() =>
                                                                    setHabitToEdit(habit)
                                                                }>
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        }
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-lg"
                                                        onClick={() => setHabitToDelete(habit)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </td>
                                            <td className="p-3 text-center font-medium sticky right-[100px] bg-background group-hover:bg-muted/50 transition-colors z-10">
                                                {habit.goal || '-'}
                                            </td>
                                            <td className="p-3 text-center font-medium sticky right-0 bg-background group-hover:bg-muted/50 transition-colors z-10">
                                                {completedCount}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <AlertDialog open={!!habitToDelete} onOpenChange={() => setHabitToDelete(null)}>
                <AlertDialogContent className="bg-[var(--background-card)] border-[var(--border-primary)] p-6">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-[var(--text-primary)] text-xl mb-2">
                            Are you sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-[var(--text-secondary)] text-base">
                            This will permanently delete the habit &ldquo;{habitToDelete?.name}
                            &rdquo; and all its progress. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6">
                        <AlertDialogCancel className="h-11 px-6 bg-[var(--background-surface)] text-[var(--text-primary)] hover:bg-[var(--background-surface-hover)] rounded-lg">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="h-11 px-6 bg-[var(--status-error)] text-white hover:bg-[var(--status-error)] rounded-lg">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
