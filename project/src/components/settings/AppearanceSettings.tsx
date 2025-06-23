import React, { useState } from 'react';
import { Palette, Save, Monitor, Sun, Moon } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { updateUserSettings } from '../../lib/settings';
import type { UserSettings } from '../../types';
import toast from 'react-hot-toast';

interface AppearanceSettingsProps {
  settings: UserSettings;
  onUpdate: (settings: UserSettings) => void;
}

export const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  settings,
  onUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    theme: settings.theme,
    language: settings.language,
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedSettings = await updateUserSettings(settings.user_id, formData);
      onUpdate(updatedSettings);
      toast.success('外観設定を更新しました');
    } catch (error) {
      console.error('外観設定の更新に失敗しました:', error);
      toast.error('外観設定の更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const themeOptions = [
    { value: 'light', label: 'ライト', icon: Sun, description: '明るいテーマ' },
    { value: 'dark', label: 'ダーク', icon: Moon, description: '暗いテーマ' },
    { value: 'auto', label: 'システム', icon: Monitor, description: 'システム設定に従う' },
  ];

  const languageOptions = [
    { value: 'ja', label: '日本語', description: 'Japanese' },
    { value: 'en', label: 'English', description: 'English' },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center mb-6">
        <Palette className="w-6 h-6 text-primary-600 mr-3" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">外観設定</h2>
          <p className="text-gray-600 text-sm">テーマと表示設定をカスタマイズします</p>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">テーマ</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFormData({ ...formData, theme: option.value as any })}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-200 text-left
                  ${formData.theme === option.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center mb-2">
                  <option.icon className="w-5 h-5 mr-2 text-gray-600" />
                  <span className="font-medium text-gray-900">{option.label}</span>
                </div>
                <p className="text-sm text-gray-600">{option.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">言語</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {languageOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFormData({ ...formData, language: option.value as any })}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-200 text-left
                  ${formData.language === option.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="font-medium text-gray-900 mb-1">{option.label}</div>
                <p className="text-sm text-gray-600">{option.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">プレビュー</h4>
          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <Palette className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h5 className="font-medium text-gray-900">MindJournal</h5>
                <p className="text-sm text-gray-600">設定プレビュー</p>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              選択したテーマと言語設定でアプリケーションが表示されます。
            </p>
          </div>
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