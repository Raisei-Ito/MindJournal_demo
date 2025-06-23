export interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  emotion_score: number;
  tags: string[];
  ai_analysis?: AIAnalysis;
  created_at: string;
  updated_at: string;
}

export interface AIAnalysis {
  emotions: EmotionData[];
  keywords: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  themes: string[];
  summary: string;
  confidence: number;
}

export interface EmotionData {
  emotion: string;
  intensity: number;
  color: string;
}

export interface DashboardStats {
  totalEntries: number;
  averageEmotion: number;
  streakDays: number;
  topTags: string[];
  emotionTrend: { date: string; score: number }[];
}

export interface Event {
  id: string;
  user_id: string;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  all_day: boolean;
  notification_enabled: boolean;
  notification_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'auto';
  language: 'ja' | 'en';
  notifications_enabled: boolean;
  email_notifications: boolean;
  default_notification_minutes: number;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export type EmotionScale = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type CalendarView = 'month' | 'week' | 'day';