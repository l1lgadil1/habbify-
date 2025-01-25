'use client';

import { useCallback, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { habitApi } from '../api/habit.api';
import { habitProgressApi } from '../api/habit-progress.api';
import { Habit, HabitStatus } from '@/shared/types/habit.types';

export const HABITS_QUERY_KEY = 'habits';

export function useHabits() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<Error | null>(null);

  const { data: habits, isLoading } = useQuery({
    queryKey: [HABITS_QUERY_KEY],
    queryFn: () => habitApi.getAll(),
  });

  const { mutate: createHabit } = useMutation({
    mutationFn: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'progress'>) =>
      habitApi.create(habit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HABITS_QUERY_KEY] });
    },
    onError: (error: Error) => setError(error),
  });

  const { mutate: updateHabit } = useMutation({
    mutationFn: ({ id, habit }: { id: string; habit: Partial<Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'progress'>> }) =>
      habitApi.update(id, habit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HABITS_QUERY_KEY] });
    },
    onError: (error: Error) => setError(error),
  });

  const { mutate: deleteHabit } = useMutation({
    mutationFn: (id: string) => habitApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HABITS_QUERY_KEY] });
    },
    onError: (error: Error) => setError(error),
  });

  const { mutate: updateProgress } = useMutation({
    mutationFn: ({ habitId, date, status }: { habitId: string; date: string; status: HabitStatus }) =>
      habitProgressApi.updateProgress(habitId, date, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HABITS_QUERY_KEY] });
    },
    onError: (error: Error) => setError(error),
  });

  const clearError = useCallback(() => setError(null), []);

  return {
    habits,
    isLoading,
    error,
    clearError,
    createHabit,
    updateHabit,
    deleteHabit,
    updateProgress,
  };
} 