export type HabitFrequency = 'daily' | 'weekly' | 'monthly';

export type HabitStatus = 'completed' | 'failed' | 'skipped' | null;

export interface HabitProgress {
  date: string;
  status: HabitStatus;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: HabitFrequency;
  startDate: string;
  endDate?: string;
  timeOfDay?: string;
  progress: HabitProgress[];
  color: string;
  icon: string;
  isArchived: boolean;
  goal: number;
  createdAt: string;
  updatedAt: string;
} 