'use client';

import { useState, useEffect, useRef } from 'react';
import { Habit, HabitStatus } from '@/shared/types/habit.types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameDay } from 'date-fns';
import { Button } from '@/shared/ui/button';
import { ChevronLeft, ChevronRight, Pencil, Trash2, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HabitForm } from './habit-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { useToast } from '@/shared/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";

interface CalendarViewProps {
  habits: Habit[];
  onUpdateProgress: (habitId: string, date: string, status: HabitStatus) => void;
  onUpdateHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
}

export function CalendarView({ habits, onUpdateProgress, onUpdateHabit, onDeleteHabit }: CalendarViewProps) {
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
      const currentDayCell = scrollContainerRef.current.querySelector(`[data-date="${format(today, 'yyyy-MM-dd')}"]`);
      
      if (currentDayCell) {
        const containerWidth = scrollContainerRef.current.clientWidth;
        const cellRect = currentDayCell.getBoundingClientRect();
        const containerRect = scrollContainerRef.current.getBoundingClientRect();
        const scrollLeft = cellRect.left - containerRect.left - (containerWidth / 2) + (cellRect.width / 2);
        
        scrollContainerRef.current.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
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
    return habit.progress.find(p => p.date === dateStr)?.status || null;
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

  const handleUpdateHabit = (habitData: Omit<Habit, 'id' | 'progress' | 'createdAt' | 'updatedAt'>) => {
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
        title: "Habit Deleted",
        description: `${habitToDelete.name} has been deleted.`,
      });
      setHabitToDelete(null);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 w-full p-5">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 w-9 rounded-full"
            onClick={handlePreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-base font-semibold text-center flex-1 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <Button 
            variant="outline" 
            size="sm"
            className="h-9 w-9 rounded-full"
            onClick={handleNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isMobileView ? (
        <div className="space-y-4 px-5 pb-5">
          {habits.map(habit => (
            <div key={habit.id} className="bg-card rounded-xl shadow-sm hover:shadow-md transition-all p-4 border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl flex-shrink-0">{habit.icon}</span>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold truncate">{habit.name}</h3>
                    <p className="text-sm text-muted-foreground">Goal: {habit.goal} days</p>
                  </div>
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[280px]">
                    <SheetHeader>
                      <SheetTitle>Actions</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-2 mt-4">
                      <HabitForm 
                        initialData={habit}
                        onSubmit={handleUpdateHabit}
                        trigger={
                          <Button 
                            variant="outline" 
                            className="w-full justify-start h-9"
                            onClick={() => setHabitToEdit(habit)}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Habit
                          </Button>
                        }
                      />
                      <Button
                        variant="outline"
                        className="w-full justify-start h-9 text-destructive hover:text-destructive"
                        onClick={() => setHabitToDelete(habit)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Habit
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="grid grid-cols-7 gap-1.5 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-[10px] text-muted-foreground font-medium">
                    {day[0]}
                  </div>
                ))}
                
                {Array.from({ length: new Date(monthStart).getDay() }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square" />
                ))}
                
                {daysInMonth.map(day => {
                  const status = getHabitStatusForDate(habit, day);
                  const isToday = isSameDay(day, new Date());
                  return (
                    <button
                      key={day.toString()}
                      onClick={() => handleStatusToggle(habit, day)}
                      className={cn(
                        "aspect-square rounded-lg flex flex-col items-center justify-center relative touch-manipulation transition-all",
                        isToday && "ring-2 ring-primary ring-offset-2",
                        status === 'completed' && "bg-green-100 text-green-800 hover:bg-green-200",
                        status === 'failed' && "bg-red-100 text-red-800 hover:bg-red-200",
                        status === 'skipped' && "bg-gray-100 text-gray-800 hover:bg-gray-200",
                        !status && "bg-secondary/40 text-secondary-foreground hover:bg-secondary"
                      )}
                    >
                      <span className="text-[10px] leading-none mb-0.5 font-medium">{format(day, 'd')}</span>
                      <span className="text-[10px] leading-none">
                        {status === 'completed' && '✓'}
                        {status === 'failed' && '×'}
                        {status === 'skipped' && '-'}
                        {!status && '○'}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center text-sm text-muted-foreground border-t pt-3">
                <span>Done: {habit.progress.filter(p => p.status === 'completed').length}</span>
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
                  <th className="sticky left-[200px] bg-background z-20 border-b" style={{ width: '1px' }}></th>
                  {daysInMonth.map(day => (
                    <th 
                      key={day.toString()} 
                      className="p-3 border-b text-center min-w-[44px] font-medium text-muted-foreground"
                      data-date={format(day, 'yyyy-MM-dd')}
                    >
                      <div className="text-sm">{format(day, 'd')}</div>
                      <div className="text-xs text-muted-foreground">{format(day, 'E')}</div>
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
                {habits.map(habit => {
                  const completedCount = habit.progress.filter(p => p.status === 'completed').length;
                  
                  return (
                    <tr key={habit.id} className="border-b group hover:bg-muted/50 transition-colors">
                      <td className="p-5 sticky left-0 bg-background group-hover:bg-muted/50 transition-colors z-10">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{habit.icon}</span>
                          <span className="font-medium">{habit.name}</span>
                        </div>
                      </td>
                      <td className="sticky left-[200px] bg-background group-hover:bg-muted/50 transition-colors z-10" style={{ width: '1px' }}></td>
                      {daysInMonth.map(day => {
                        const status = getHabitStatusForDate(habit, day);
                        const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                        return (
                          <td 
                            key={day.toString()} 
                            className="p-3 text-center"
                            data-date={format(day, 'yyyy-MM-dd')}
                          >
                            <button
                              onClick={() => handleStatusToggle(habit, day)}
                              className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center text-sm cursor-pointer transition-all",
                                isToday && "ring-2 ring-primary ring-offset-2",
                                status === 'completed' && "bg-green-100 text-green-800 hover:bg-green-200",
                                status === 'failed' && "bg-red-100 text-red-800 hover:bg-red-200",
                                status === 'skipped' && "bg-gray-100 text-gray-800 hover:bg-gray-200",
                                !status && "bg-secondary/40 text-secondary-foreground hover:bg-secondary"
                              )}
                            >
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
                                onClick={() => setHabitToEdit(habit)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                            onClick={() => setHabitToDelete(habit)}
                          >
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the habit &ldquo;{habitToDelete?.name}&rdquo; and all its progress.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 