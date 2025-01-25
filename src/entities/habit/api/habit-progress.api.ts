import { supabase } from '@/shared/api/supabase';
import { HabitStatus } from '@/shared/types/habit.types';

export const habitProgressApi = {
  async updateProgress(habitId: string, date: string, status: HabitStatus) {
    if (!status) {
      const { error } = await supabase
        .from('habit_progress')
        .delete()
        .eq('habit_id', habitId)
        .eq('date', date);

      if (error) throw error;
      return;
    }

    const { error } = await supabase
      .from('habit_progress')
      .upsert({
        habit_id: habitId,
        date,
        status
      }, {
        onConflict: 'habit_id,date'
      });

    if (error) throw error;
  },

  async getProgressByDateRange(habitId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('habit_progress')
      .select('*')
      .eq('habit_id', habitId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date');

    if (error) throw error;
    return data;
  },

  async getStatistics(habitId: string) {
    const { data, error } = await supabase
      .from('habit_statistics')
      .select('*')
      .eq('habit_id', habitId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
}; 