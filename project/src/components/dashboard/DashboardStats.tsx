import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Heart, Calendar, Trophy } from 'lucide-react';
import { Card } from '../ui/Card';
import type { DashboardStats as StatsType } from '../../types';

interface DashboardStatsProps {
  stats: StatsType;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: '総エントリー数',
      value: stats.totalEntries,
      icon: BookOpen,
      color: 'text-primary-600',
      bg: 'bg-primary-100',
    },
    {
      title: '平均気分',
      value: `${stats.averageEmotion.toFixed(1)}/10`,
      icon: Heart,
      color: 'text-secondary-600',
      bg: 'bg-secondary-100',
    },
    {
      title: '連続記録',
      value: `${stats.streakDays}日`,
      icon: Calendar,
      color: 'text-accent-600',
      bg: 'bg-accent-100',
    },
    {
      title: '今月の記録',
      value: stats.emotionTrend.length,
      icon: Trophy,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card hover className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};