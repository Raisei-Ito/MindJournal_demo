import { supabase } from './supabase';
import type { JournalEntry, DashboardStats } from '../types';

export const createJournalEntry = async (entry: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>) => {
  console.log('Creating journal entry:', entry);
  
  const { data, error } = await supabase
    .from('journal_entries')
    .insert([entry])
    .select()
    .single();

  if (error) {
    console.error('Database error:', error);
    throw error;
  }
  
  console.log('Journal entry created successfully:', data);
  return data;
};

export const getJournalEntries = async (userId: string): Promise<JournalEntry[]> => {
  console.log('Fetching journal entries for user:', userId);
  
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Database error:', error);
    throw error;
  }
  
  console.log('Journal entries fetched:', data?.length || 0);
  return data || [];
};

export const updateJournalEntry = async (id: string, updates: Partial<JournalEntry>) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteJournalEntry = async (id: string) => {
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getDashboardStats = async (userId: string): Promise<DashboardStats> => {
  const entries = await getJournalEntries(userId);
  
  const totalEntries = entries.length;
  const averageEmotion = entries.length > 0 
    ? entries.reduce((sum, entry) => sum + entry.emotion_score, 0) / entries.length 
    : 0;
  
  // Calculate streak (simplified)
  const streakDays = calculateStreak(entries);
  
  // Get top tags
  const tagCounts = entries.reduce((acc, entry) => {
    entry.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);
  
  const topTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tag]) => tag);
  
  // Emotion trend for last 30 days
  const emotionTrend = entries
    .slice(0, 30)
    .map(entry => ({
      date: entry.created_at,
      score: entry.emotion_score,
    }))
    .reverse();

  return {
    totalEntries,
    averageEmotion,
    streakDays,
    topTags,
    emotionTrend,
  };
};

const calculateStreak = (entries: JournalEntry[]): number => {
  if (entries.length === 0) return 0;
  
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);
  
  for (const entry of entries) {
    const entryDate = new Date(entry.created_at);
    const daysDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
};