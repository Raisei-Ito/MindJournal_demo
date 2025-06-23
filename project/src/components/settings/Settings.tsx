import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Palette, Globe, Shield, Download, Upload } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProfileSettings } from './ProfileSettings';
import { NotificationSettings } from './NotificationSettings';
import { AppearanceSettings } from './AppearanceSettings';
import { PrivacySettings } from './PrivacySettings';
import { DataSettings } from './DataSettings';
import { useAuth } from '../../contexts/AuthContext';
import { getOrCreateUserSettings } from '../../lib/settings';
import type { UserSettings } from '../../types';

type SettingsTab = 'profile' | 'notifications' | 'appearance' | 'privacy' | 'data';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      const userSettings = await getOrCreateUserSettings(user.id);
      setSettings(userSettings);
    } catch (error) {
      console.error('設定の読み込みに失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsUpdate = (updatedSettings: UserSettings) => {
    setSettings(updatedSettings);
  };

  const tabs = [
    {
      id: 'profile' as SettingsTab,
      name: 'プロフィール',
      icon: User,
      description: 'アカウント情報の管理',
    },
    {
      id: 'notifications' as SettingsTab,
      name: '通知',
      icon: Bell,
      description: '通知設定の管理',
    },
    {
      id: 'appearance' as SettingsTab,
      name: '外観',
      icon: Palette,
      description: 'テーマと表示設定',
    },
    {
      id: 'privacy' as SettingsTab,
      name: 'プライバシー',
      icon: Shield,
      description: 'プライバシーとセキュリティ',
    },
    {
      id: 'data' as SettingsTab,
      name: 'データ',
      icon: Download,
      description: 'バックアップとエクスポート',
    },
  ];

  const renderTabContent = () => {
    if (!settings) return null;

    switch (activeTab) {
      case 'profile':
        return <ProfileSettings user={user} />;
      case 'notifications':
        return (
          <NotificationSettings
            settings={settings}
            onUpdate={handleSettingsUpdate}
          />
        );
      case 'appearance':
        return (
          <AppearanceSettings
            settings={settings}
            onUpdate={handleSettingsUpdate}
          />
        );
      case 'privacy':
        return <PrivacySettings />;
      case 'data':
        return <DataSettings user={user} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <SettingsIcon className="w-8 h-8 mr-3 text-primary-600" />
          設定
        </h1>
        <p className="text-gray-600 mt-1">
          アプリケーションの設定をカスタマイズしましょう
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center px-3 py-2 text-left rounded-lg transition-all duration-200
                    ${activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <tab.icon className="w-5 h-5 mr-3" />
                  <div>
                    <div className="font-medium">{tab.name}</div>
                    <div className="text-xs text-gray-500">{tab.description}</div>
                  </div>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};