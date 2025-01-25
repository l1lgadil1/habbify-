'use client';

import { User } from '@supabase/supabase-js';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Habit, HabitStatus } from '@/shared/types/habit.types';
import { CalendarView } from './components/calendar-view';
import { HabitForm } from './components/habit-form';
import { useToast } from '@/shared/hooks/use-toast';
import { Button } from '@/shared/ui/button';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardClientProps {
  initialHabits: Habit[];
  user: User | null;
}

type NewHabitData = Pick<Habit, 'name' | 'description' | 'icon' | 'frequency' | 'goal' | 'color'>;

export function DashboardClient({ initialHabits, user }: DashboardClientProps) {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.replace('/auth/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleAddHabit = async (habitData: NewHabitData) => {
    try {
      const newHabit = {
        ...habitData,
        user_id: user?.id as string,
        progress: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('habits')
        .insert([newHabit])
        .select()
        .single();

      if (error) throw error;

      setHabits((prev) => [...prev, data]);
      toast({
        title: 'Success!',
        description: `Habit "${habitData.name}" has been created.`,
      });
    } catch (error) {
      console.error('Error adding habit:', error);
      toast({
        title: 'Error',
        description: 'Failed to create habit. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateHabit = async (updatedHabit: Habit) => {
    try {
      const { error } = await supabase
        .from('habits')
        .update({
          ...updatedHabit,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updatedHabit.id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setHabits((prev) =>
        prev.map((habit) => (habit.id === updatedHabit.id ? updatedHabit : habit))
      );

      toast({
        title: 'Success!',
        description: `Habit "${updatedHabit.name}" has been updated.`,
      });
    } catch (error) {
      console.error('Error updating habit:', error);
      toast({
        title: 'Error',
        description: 'Failed to update habit. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setHabits((prev) => prev.filter((habit) => habit.id !== habitId));
      toast({
        title: 'Success!',
        description: 'Habit has been deleted.',
      });
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete habit. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateProgress = async (habitId: string, date: string, status: HabitStatus) => {
    try {
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) return;

      const updatedProgress = [...habit.progress];
      const existingIndex = updatedProgress.findIndex((p) => p.date === date);

      if (existingIndex !== -1) {
        updatedProgress[existingIndex] = { date, status };
      } else {
        updatedProgress.push({ date, status });
      }

      const updatedHabit = { ...habit, progress: updatedProgress };
      const { error } = await supabase
        .from('habits')
        .update({ progress: updatedProgress })
        .eq('id', habitId);

      if (error) throw error;

      setHabits((prev) =>
        prev.map((h) => (h.id === habitId ? updatedHabit : h))
      );

      toast({
        title: 'Success!',
        description: `Progress updated for "${habit.name}".`,
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: 'Error',
        description: 'Failed to update progress. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Habits</h1>
          <p className="text-muted-foreground mt-2">
            Track and manage your daily habits
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleSignOut}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <Button
          variant={view === 'calendar' ? 'default' : 'outline'}
          onClick={() => setView('calendar')}
          className={cn('flex-1')}
        >
          Calendar View
        </Button>
        <Button
          variant={view === 'list' ? 'default' : 'outline'}
          onClick={() => setView('list')}
          className={cn('flex-1')}
        >
          List View
        </Button>
        <HabitForm onSubmit={handleAddHabit} />
      </div>

      <div className="bg-card rounded-lg shadow">
        {view === 'calendar' ? (
          <CalendarView
            habits={habits}
            onUpdateHabit={handleUpdateHabit}
            onDeleteHabit={handleDeleteHabit}
            onUpdateProgress={handleUpdateProgress}
          />
        ) : (
          <div className="p-6">
            {habits.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-muted-foreground">
                  No habits yet
                </h3>
                <p className="text-muted-foreground mt-2">
                  Start by adding your first habit!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {habits.map((habit) => (
                  <div
                    key={habit.id}
                    className="p-4 rounded-lg border hover:border-primary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{habit.icon}</span>
                      <div>
                        <h3 className="font-semibold">{habit.name}</h3>
                        {habit.description && (
                          <p className="text-muted-foreground text-sm">
                            {habit.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
} 