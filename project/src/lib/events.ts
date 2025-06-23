import { supabase } from './supabase';
import type { Event } from '../types';

export const createEvent = async (event: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('events')
    .insert([event])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getEvents = async (userId: string, startDate?: string, endDate?: string): Promise<Event[]> => {
  let query = supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: true });

  if (startDate && endDate) {
    query = query
      .gte('start_date', startDate)
      .lte('end_date', endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
};

export const updateEvent = async (id: string, updates: Partial<Event>) => {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteEvent = async (id: string) => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getEventsForDate = async (userId: string, date: string): Promise<Event[]> => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .or(`and(start_date.gte.${startOfDay.toISOString()},start_date.lte.${endOfDay.toISOString()}),and(end_date.gte.${startOfDay.toISOString()},end_date.lte.${endOfDay.toISOString()}),and(start_date.lte.${startOfDay.toISOString()},end_date.gte.${endOfDay.toISOString()})`)
    .order('start_date', { ascending: true });

  if (error) throw error;
  return data || [];
};