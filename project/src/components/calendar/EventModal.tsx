import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Calendar, Clock, MapPin, Bell, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { createEvent, updateEvent, deleteEvent } from '../../lib/events';
import type { Event } from '../../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const eventSchema = z.object({
  title: z.string().min(1, 'タイトルを入力してください'),
  description: z.string().optional(),
  location: z.string().optional(),
  start_date: z.string().min(1, '開始日時を入力してください'),
  end_date: z.string().min(1, '終了日時を入力してください'),
  all_day: z.boolean(),
  notification_enabled: z.boolean(),
  notification_minutes: z.number().min(0),
});

type EventData = z.infer<typeof eventSchema>;

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  event?: Event | null;
  selectedDate?: Date | null;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  event,
  selectedDate,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<EventData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      start_date: '',
      end_date: '',
      all_day: false,
      notification_enabled: true,
      notification_minutes: 15,
    },
  });

  const allDay = watch('all_day');

  useEffect(() => {
    if (isOpen) {
      if (event) {
        // 編集モード
        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);
        
        reset({
          title: event.title,
          description: event.description,
          location: event.location,
          start_date: event.all_day 
            ? format(startDate, 'yyyy-MM-dd')
            : format(startDate, "yyyy-MM-dd'T'HH:mm"),
          end_date: event.all_day
            ? format(endDate, 'yyyy-MM-dd')
            : format(endDate, "yyyy-MM-dd'T'HH:mm"),
          all_day: event.all_day,
          notification_enabled: event.notification_enabled,
          notification_minutes: event.notification_minutes,
        });
      } else {
        // 新規作成モード
        const defaultDate = selectedDate || new Date();
        const defaultEndDate = new Date(defaultDate);
        defaultEndDate.setHours(defaultDate.getHours() + 1);

        reset({
          title: '',
          description: '',
          location: '',
          start_date: format(defaultDate, "yyyy-MM-dd'T'HH:mm"),
          end_date: format(defaultEndDate, "yyyy-MM-dd'T'HH:mm"),
          all_day: false,
          notification_enabled: true,
          notification_minutes: 15,
        });
      }
    }
  }, [isOpen, event, selectedDate, reset]);

  const handleSaveEvent = async (data: EventData) => {
    if (!user) return;

    setLoading(true);
    try {
      const eventData = {
        ...data,
        user_id: user.id,
        description: data.description || '',
        location: data.location || '',
        start_date: new Date(data.start_date).toISOString(),
        end_date: new Date(data.end_date).toISOString(),
      };

      if (event) {
        await updateEvent(event.id, eventData);
        toast.success('予定を更新しました');
      } else {
        await createEvent(eventData);
        toast.success('予定を作成しました');
      }

      onSave();
    } catch (error) {
      console.error('予定の保存に失敗しました:', error);
      toast.error('予定の保存に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!event) return;

    setLoading(true);
    try {
      await deleteEvent(event.id);
      toast.success('予定を削除しました');
      onSave();
    } catch (error) {
      console.error('予定の削除に失敗しました:', error);
      toast.error('予定の削除に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleAllDayChange = (checked: boolean) => {
    setValue('all_day', checked);
    
    if (checked) {
      // 終日の場合は時間を削除
      const startDate = watch('start_date');
      const endDate = watch('end_date');
      
      if (startDate) {
        setValue('start_date', format(new Date(startDate), 'yyyy-MM-dd'));
      }
      if (endDate) {
        setValue('end_date', format(new Date(endDate), 'yyyy-MM-dd'));
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {event ? '予定を編集' : '新しい予定'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleSaveEvent)} className="space-y-4">
            <Input
              label="タイトル"
              placeholder="予定のタイトル"
              {...register('title')}
              error={errors.title?.message}
              icon={<Calendar className="w-4 h-4" />}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                説明
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="予定の詳細を入力してください"
              />
            </div>

            <Input
              label="場所"
              placeholder="場所を入力してください"
              {...register('location')}
              icon={<MapPin className="w-4 h-4" />}
            />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="all_day"
                {...register('all_day')}
                onChange={(e) => handleAllDayChange(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="all_day" className="text-sm font-medium text-gray-700">
                終日
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="開始日時"
                type={allDay ? 'date' : 'datetime-local'}
                {...register('start_date')}
                error={errors.start_date?.message}
                icon={<Clock className="w-4 h-4" />}
              />

              <Input
                label="終了日時"
                type={allDay ? 'date' : 'datetime-local'}
                {...register('end_date')}
                error={errors.end_date?.message}
                icon={<Clock className="w-4 h-4" />}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="notification_enabled"
                  {...register('notification_enabled')}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="notification_enabled" className="text-sm font-medium text-gray-700 flex items-center">
                  <Bell className="w-4 h-4 mr-1" />
                  通知を有効にする
                </label>
              </div>

              {watch('notification_enabled') && (
                <div className="ml-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    通知タイミング
                  </label>
                  <select
                    {...register('notification_minutes', { valueAsNumber: true })}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value={0}>開始時刻</option>
                    <option value={5}>5分前</option>
                    <option value={15}>15分前</option>
                    <option value={30}>30分前</option>
                    <option value={60}>1時間前</option>
                    <option value={1440}>1日前</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4">
              {event && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  削除
                </Button>
              )}

              <div className="flex space-x-3 ml-auto">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                >
                  キャンセル
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                >
                  {event ? '更新' : '作成'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Card>

      {/* 削除確認モーダル */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <Card className="p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              予定を削除しますか？
            </h3>
            <p className="text-gray-600 mb-6">
              この操作は取り消すことができません。
            </p>
            <div className="flex space-x-3">
              <Button
                variant="ghost"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
              >
                キャンセル
              </Button>
              <Button
                onClick={handleDeleteEvent}
                loading={loading}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                削除
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};