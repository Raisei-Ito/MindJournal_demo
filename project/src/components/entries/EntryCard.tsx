import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, Heart, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { JournalEntry } from '../../types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface EntryCardProps {
  entry: JournalEntry;
  onClick?: () => void;
  onEdit?: (entry: JournalEntry) => void;
  onDelete?: (entryId: string) => void;
}

const emotionColors = {
  1: '#dc2626', 2: '#ea580c', 3: '#f59e0b', 4: '#eab308', 5: '#84cc16',
  6: '#22c55e', 7: '#10b981', 8: '#06b6d4', 9: '#3b82f6', 10: '#8b5cf6',
};

export const EntryCard: React.FC<EntryCardProps> = ({ 
  entry, 
  onClick, 
  onEdit, 
  onDelete 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const emotionColor = emotionColors[entry.emotion_score as keyof typeof emotionColors];

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onEdit?.(entry);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(entry.id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="relative"
    >
      <Card hover className="p-6 cursor-pointer" onClick={onClick}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
            {entry.title}
          </h3>
          <div className="relative">
            <button 
              onClick={handleMenuClick}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            
            {/* ドロップダウンメニュー */}
            {showMenu && (
              <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
                <button
                  onClick={handleEdit}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Edit className="w-3 h-3 mr-2" />
                  編集
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <Trash2 className="w-3 h-3 mr-2" />
                  削除
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {entry.content}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {format(new Date(entry.created_at), 'yyyy年M月d日', { locale: ja })}
            </div>
            <div className="flex items-center">
              <Heart 
                className="w-4 h-4 mr-1" 
                style={{ color: emotionColor }}
                fill={emotionColor}
              />
              {entry.emotion_score}/10
            </div>
          </div>

          {entry.tags.length > 0 && (
            <div className="flex items-center">
              <Tag className="w-4 h-4 text-gray-400 mr-2" />
              <div className="flex space-x-1">
                {entry.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {entry.tags.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{entry.tags.length - 2}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 削除確認モーダル */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              日記を削除しますか？
            </h3>
            <p className="text-gray-600 mb-6">
              「{entry.title}」を削除します。この操作は取り消すことができません。
            </p>
            <div className="flex space-x-3">
              <Button
                variant="ghost"
                onClick={handleCancelDelete}
                className="flex-1"
              >
                キャンセル
              </Button>
              <Button
                onClick={handleConfirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                削除
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* メニューを閉じるためのオーバーレイ */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-5"
          onClick={() => setShowMenu(false)}
        />
      )}
    </motion.div>
  );
};