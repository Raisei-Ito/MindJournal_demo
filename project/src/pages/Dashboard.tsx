import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { EmotionChart } from '../components/dashboard/EmotionChart';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PenTool, BookOpen, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardStats } from '../lib/database';
import type { DashboardStats as StatsType } from '../types';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;
      
      try {
        const dashboardStats = await getDashboardStats(user.id);
        setStats(dashboardStats);
      } catch (error) {
        console.error('ダッシュボード統計の読み込みに失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">ダッシュボードデータの読み込みに失敗しました</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          おかえりなさい、{user?.user_metadata?.full_name || 'さん'}！
        </h1>
        <p className="text-gray-600">
          今日の気分はいかがですか？あなたの想いを記録しましょう。
        </p>
      </motion.div>

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {stats.emotionTrend.length > 0 ? (
            <EmotionChart data={stats.emotionTrend} />
          ) : (
            <Card className="p-8 text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                あなたの旅を始めましょう
              </h3>
              <p className="text-gray-600 mb-4">
                最初の日記を書いて、感情の推移を確認してみましょう。
              </p>
              <Button onClick={() => onNavigate('write')}>
                最初の日記を書く
              </Button>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              クイックアクション
            </h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onNavigate('write')}
              >
                <PenTool className="w-4 h-4 mr-2" />
                新しい日記
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => onNavigate('entries')}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                日記を見る
              </Button>
            </div>
          </Card>

          {stats.topTags.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                よく使うタグ
              </h3>
              <div className="flex flex-wrap gap-2">
                {stats.topTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};