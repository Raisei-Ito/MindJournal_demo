import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CalendarGrid } from './CalendarGrid';
import { EventModal } from './EventModal';
import { EventList } from './EventList';
import { useAuth } from '../../contexts/AuthContext';
import { getEvents, getEventsForDate } from '../../lib/events';
import type { Event, CalendarView } from '../../types';
import { format, addMonths, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ja } from 'date-fns/locale';

export const Calendar: React.FC = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<CalendarView>('month');
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState<Event[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, [user, currentDate]);

  useEffect(() => {
    if (selectedDate && user) {
      loadEventsForDate(selectedDate);
    }
  }, [selectedDate, user, events]);

  const loadEvents = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const start = startOfMonth(currentDate).toISOString();
      const end = endOfMonth(currentDate).toISOString();
      const monthEvents = await getEvents(user.id, start, end);
      setEvents(monthEvents);
    } catch (error) {
      console.error('イベントの読み込みに失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEventsForDate = async (date: Date) => {
    if (!user) return;

    try {
      const dateEvents = await getEventsForDate(user.id, date.toISOString());
      setSelectedDateEvents(dateEvents);
    } catch (error) {
      console.error('日付のイベント読み込みに失敗しました:', error);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEventSaved = () => {
    loadEvents();
    setShowEventModal(false);
    setEditingEvent(null);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowEventModal(true);
  };

  const handleNewEvent = () => {
    setEditingEvent(null);
    setShowEventModal(true);
  };

  const viewButtons = [
    { key: 'month' as CalendarView, label: '月' },
    { key: 'week' as CalendarView, label: '週' },
    { key: 'day' as CalendarView, label: '日' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <CalendarIcon className="w-8 h-8 mr-3 text-primary-600" />
            カレンダー
          </h1>
          <p className="text-gray-600 mt-1">
            予定を管理して、充実した日々を送りましょう
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            {viewButtons.map((button) => (
              <button
                key={button.key}
                onClick={() => setView(button.key)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  view === button.key
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {button.label}
              </button>
            ))}
          </div>

          <Button onClick={handleNewEvent} className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            新しい予定
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {format(currentDate, 'yyyy年M月', { locale: ja })}
              </h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevMonth}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                >
                  今日
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextMonth}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <CalendarGrid
                currentDate={currentDate}
                selectedDate={selectedDate}
                events={events}
                onDateClick={handleDateClick}
                onEventClick={handleEditEvent}
              />
            )}
          </Card>
        </div>

        <div className="space-y-6">
          {selectedDate && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {format(selectedDate, 'M月d日（E）', { locale: ja })}の予定
              </h3>
              <EventList
                events={selectedDateEvents}
                onEventClick={handleEditEvent}
                onNewEvent={handleNewEvent}
              />
            </Card>
          )}

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              今月の予定
            </h3>
            <div className="space-y-2">
              {events.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleEditEvent(event)}
                >
                  <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                  <p className="text-xs text-gray-600">
                    {format(new Date(event.start_date), 'M/d HH:mm', { locale: ja })}
                  </p>
                </div>
              ))}
              {events.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">
                  今月の予定はありません
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>

      <EventModal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setEditingEvent(null);
        }}
        onSave={handleEventSaved}
        event={editingEvent}
        selectedDate={selectedDate}
      />
    </div>
  );
};