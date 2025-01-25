'use client';

import { useQuery } from '@tanstack/react-query';
import { habitApi } from '../api/habit.api';
import { habitProgressApi } from '../api/habit-progress.api';
import { HABITS_QUERY_KEY } from './use-habits';

export function useHabit(habitId: string) {
  const { data: habit, isLoading: isHabitLoading } = useQuery({
    queryKey: [HABITS_QUERY_KEY, habitId],
    queryFn: () => habitApi.getById(habitId),
    enabled: !!habitId,
  });

  const getProgressByDateRange = async (startDate: string, endDate: string) => {
    return habitProgressApi.getProgressByDateRange(habitId, startDate, endDate);
  };

  const getStatistics = async () => {
    return habitProgressApi.getStatistics(habitId);
  };

  return {
    habit,
    isHabitLoading,
    getProgressByDateRange,
    getStatistics,
  };
} 