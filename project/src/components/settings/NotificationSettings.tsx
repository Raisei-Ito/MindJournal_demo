import React, { useState } from 'react';
import { Bell, Save } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { updateUserSettings } from '../../lib/settings';
import type { UserSettings } from '../../types';
import toast from 'react-hot-toast';

interface NotificationSettingsProps {
  settings: UserSettings;
  onUpdate: (settings: UserSettings) => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  settings,
  onUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    notifications_enabled: settings.notifications_enabled,
    email_notifications: settings.email_notifications,
    default_notification_minutes: settings.default_notification_minutes,
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedSettings = await updateUserSettings(settings.user_id, formData);
      onUpdate(updatedSettings);
      toast.success('通知設定を更新しました');
    } catch (error) {
      console.error('通知設定の更新に失敗しました:', error);
      toast.error('通知設定の更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const notificationOptions = [
    { value: 0, label: '開始時刻' },
    { value: 5, label: '5分前' },
    { value: 15, label: '15分前' },
    { value: 30, label: '30分前' },
    { value: 60, label: '1時間前' },
    { value: 1440, label: '1日前' },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center mb-6">
        <Bell className="w-6 h-6 text-primary-600 mr-3" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">通知設定</h2>
          <p className="text-gray-600 text-sm">通知の受信設定を管理します</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">プッシュ通知</h3>
            <p className="text-sm text-gray-600">アプリ内での通知を受け取る</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.notifications_enabled}
              onChange={(e) => setFormData({ ...formData, notifications_enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">メール通知</h3>
            <p className="text-sm text-gray-600">重要な更新をメールで受け取る</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.email_notifications}
              onChange={(e) => setFormData({ ...formData, email_notifications: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">デフォルト通知タイミング</h3>
          <p className="text-sm text-gray-600 mb-4">新しい予定のデフォルト通知タイミング</p>
          <select
            value={formData.default_notification_minutes}
            onChange={(e) => setFormData({ ...formData, default_notification_minutes: parseInt(e.target.value) })}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            {notificationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">通知について</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 予定の開始時刻に基づいて通知が送信されます</li>
            <li>• ブラウザの通知許可が必要です</li>
            <li>• メール通知は重要な更新のみ送信されます</li>
          </ul>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            loading={loading}
            className="flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            変更を保存
          </Button>
        </div>
      </div>
    </Card>
  );
};