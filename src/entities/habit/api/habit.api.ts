import { supabase } from '@/shared/api/supabase';
import { Database } from '@/shared/types/supabase';
import { Habit } from '@/shared/types/habit.types';

type DBHabit = Database['public']['Tables']['habits']['Row'];
type DBHabitProgress = Database['public']['Tables']['habit_progress']['Row'];
type DBHabitStatistics = Database['public']['Views']['habit_statistics']['Row'];

const transformHabit = (
  habit: DBHabit,
  progress: DBHabitProgress[] = [],
  statistics?: DBHabitStatistics
): Habit => ({
  id: habit.id,
  name: habit.name,
  description: habit.description || undefined,
  frequency: habit.frequency,
  startDate: habit.start_date,
  endDate: habit.end_date || undefined,
  timeOfDay: habit.time_of_day || undefined,
  color: habit.color,
  icon: habit.icon,
  isArchived: habit.is_archived,
  goal: habit.goal,
  createdAt: habit.created_at,
  updatedAt: habit.updated_at,
  progress: progress.map(p => ({
    date: p.date,
    status: p.status
  })),
  statistics: statistics ? {
    completedCount: statistics.completed_count,
    failedCount: statistics.failed_count,
    skippedCount: statistics.skipped_count,
    completionRate: statistics.completion_rate
  } : undefined
});

export const habitApi = {
  async getAll() {
    const { data: habits, error: habitsError } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: false });

    if (habitsError) throw habitsError;

    const { data: progress, error: progressError } = await supabase
      .from('habit_progress')
      .select('*');

    if (progressError) throw progressError;

    const { data: statistics, error: statsError } = await supabase
      .from('habit_statistics')
      .select('*');

    if (statsError) throw statsError;

    return habits.map(habit => 
      transformHabit(
        habit,
        progress.filter(p => p.habit_id === habit.id),
        statistics.find(s => s.habit_id === habit.id)
      )
    );
  },

  async getById(id: string) {
    const { data: habit, error: habitError } = await supabase
      .from('habits')
      .select('*')
      .eq('id', id)
      .single();

    if (habitError) throw habitError;

    const { data: progress, error: progressError } = await supabase
      .from('habit_progress')
      .select('*')
      .eq('habit_id', id);

    if (progressError) throw progressError;

    const { data: statistics, error: statsError } = await supabase
      .from('habit_statistics')
      .select('*')
      .eq('habit_id', id)
      .single();

    if (statsError && statsError.code !== 'PGRST116') throw statsError;

    return transformHabit(habit, progress, statistics);
  },

  async create(habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'progress'>) {
    const { data, error } = await supabase
      .from('habits')
      .insert({
        name: habit.name,
        description: habit.description,
        frequency: habit.frequency,
        start_date: habit.startDate,
        end_date: habit.endDate,
        time_of_day: habit.timeOfDay,
        color: habit.color,
        icon: habit.icon,
        is_archived: habit.isArchived,
        goal: habit.goal
      })
      .select()
      .single();

    if (error) throw error;
    return transformHabit(data);
  },

  async update(id: string, habit: Partial<Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'progress'>>) {
    const { data, error } = await supabase
      .from('habits')
      .update({
        name: habit.name,
        description: habit.description,
        frequency: habit.frequency,
        start_date: habit.startDate,
        end_date: habit.endDate,
        time_of_day: habit.timeOfDay,
        color: habit.color,
        icon: habit.icon,
        is_archived: habit.isArchived,
        goal: habit.goal
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return transformHabit(data);
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}; 