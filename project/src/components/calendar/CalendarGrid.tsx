import React from 'react';
import { motion } from 'framer-motion';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  isSameMonth, 
  isSameDay, 
  isToday 
} from 'date-fns';
import { ja } from 'date-fns/locale';
import type { Event } from '../../types';

interface CalendarGridProps {
  currentDate: Date;
  selectedDate: Date | null;
  events: Event[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  selectedDate,
  events,
  onDateClick,
  onEventClick,
}) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.start_date);
      const eventEnd = new Date(event.end_date);
      
      if (event.all_day) {
        return isSameDay(eventStart, date) || 
               (eventStart <= date && eventEnd >= date);
      }
      
      return isSameDay(eventStart, date);
    });
  };

  return (
    <div className="bg-white rounded-lg">
      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-t-lg overflow-hidden">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`bg-gray-50 p-3 text-center text-sm font-medium ${
              index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isDayToday = isToday(day);

          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.01 }}
              className={`
                bg-white min-h-[120px] p-2 cursor-pointer hover:bg-gray-50 transition-colors
                ${!isCurrentMonth ? 'text-gray-400 bg-gray-50' : ''}
                ${isSelected ? 'ring-2 ring-primary-500 ring-inset' : ''}
              `}
              onClick={() => onDateClick(day)}
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={`
                      text-sm font-medium
                      ${isDayToday ? 'bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}
                      ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
                    `}
                  >
                    {format(day, 'd')}
                  </span>
                </div>

                <div className="flex-1 space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="text-xs p-1 bg-primary-100 text-primary-800 rounded truncate cursor-pointer hover:bg-primary-200 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayEvents.length - 3}件
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};