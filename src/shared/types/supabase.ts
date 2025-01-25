export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type HabitFrequency = 'daily' | 'weekly' | 'monthly'
export type HabitStatus = 'completed' | 'failed' | 'skipped'

export interface Database {
  public: {
    Tables: {
      habits: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          frequency: HabitFrequency
          start_date: string
          end_date: string | null
          time_of_day: string | null
          color: string
          icon: string
          is_archived: boolean
          goal: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          frequency?: HabitFrequency
          start_date: string
          end_date?: string | null
          time_of_day?: string | null
          color?: string
          icon?: string
          is_archived?: boolean
          goal?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          frequency?: HabitFrequency
          start_date?: string
          end_date?: string | null
          time_of_day?: string | null
          color?: string
          icon?: string
          is_archived?: boolean
          goal?: number
          created_at?: string
          updated_at?: string
        }
      }
      habit_progress: {
        Row: {
          id: string
          habit_id: string
          date: string
          status: HabitStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          habit_id: string
          date: string
          status: HabitStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          habit_id?: string
          date?: string
          status?: HabitStatus
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      habit_statistics: {
        Row: {
          habit_id: string
          user_id: string
          name: string
          completed_count: number
          failed_count: number
          skipped_count: number
          completion_rate: number
        }
      }
    }
  }
} 