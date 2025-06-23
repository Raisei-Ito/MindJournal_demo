import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Event } from '../../types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface EventListProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  onNewEvent: () => void;
}

export const EventList: React.FC<EventListProps> = ({
  events,
  onEventClick,
  onNewEvent,
}) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">この日の予定はありません</p>
        <Button
          size="sm"
          onClick={onNewEvent}
          className="flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          予定を追加
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => onEventClick(event)}
        >
          <h4 className="font-medium text-gray-900 mb-1">{event.title}</h4>
          
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <Clock className="w-3 h-3 mr-1" />
            {event.all_day ? (
              '終日'
            ) : (
              `${format(new Date(event.start_date), 'HH:mm', { locale: ja })} - ${format(new Date(event.end_date), 'HH:mm', { locale: ja })}`
            )}
          </div>

          {event.location && (
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <MapPin className="w-3 h-3 mr-1" />
              {event.location}
            </div>
          )}

          {event.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {event.description}
            </p>
          )}
        </motion.div>
      ))}

      <Button
        size="sm"
        variant="outline"
        onClick={onNewEvent}
        className="w-full flex items-center justify-center"
      >
        <Plus className="w-4 h-4 mr-2" />
        予定を追加
      </Button>
    </div>
  );
};