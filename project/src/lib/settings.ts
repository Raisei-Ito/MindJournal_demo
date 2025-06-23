import { supabase } from './supabase';
import type { UserSettings } from '../types';

export const getUserSettings = async (userId: string): Promise<UserSettings | null> => {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const createUserSettings = async (settings: Omit<UserSettings, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('user_settings')
    .insert([settings])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateUserSettings = async (userId: string, updates: Partial<UserSettings>) => {
  const { data, error } = await supabase
    .from('user_settings')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getOrCreateUserSettings = async (userId: string): Promise<UserSettings> => {
  let settings = await getUserSettings(userId);
  
  if (!settings) {
    settings = await createUserSettings({
      user_id: userId,
      theme: 'light',
      language: 'ja',
      notifications_enabled: true,
      email_notifications: true,
      default_notification_minutes: 15,
      timezone: 'Asia/Tokyo',
    });
  }
  
  return settings;
};