import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createJournalEntry } from '../lib/database';
import { JournalEditor } from '../components/journal/JournalEditor';
import toast from 'react-hot-toast';
import type { EmotionScale } from '../types';

interface WriteEntryProps {
  onNavigate: (tab: string) => void;
}

export const WriteEntry: React.FC<WriteEntryProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSave = async (data: {
    title: string;
    content: string;
    emotion_score: EmotionScale;
    tags: string[];
  }) => {
    if (!user) {
      toast.error('ユーザーが認証されていません');
      return;
    }

    setLoading(true);
    console.log('Saving journal entry:', data);

    try {
      const entryData = {
        user_id: user.id,
        title: data.title,
        content: data.content,
        emotion_score: data.emotion_score,
        tags: data.tags,
      };

      console.log('Entry data to save:', entryData);
      
      const savedEntry = await createJournalEntry(entryData);
      console.log('Entry saved successfully:', savedEntry);
      
      toast.success('日記を保存しました！');
      onNavigate('entries');
    } catch (error) {
      console.error('日記の保存に失敗しました:', error);
      
      // より詳細なエラーメッセージを表示
      if (error instanceof Error) {
        if (error.message.includes('relation') && error.message.includes('does not exist')) {
          toast.error('データベーステーブルが見つかりません。Supabaseの設定を確認してください。');
        } else if (error.message.includes('permission')) {
          toast.error('データベースへのアクセス権限がありません。');
        } else {
          toast.error(`保存エラー: ${error.message}`);
        }
      } else {
        toast.error('日記の保存に失敗しました。もう一度お試しください。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <JournalEditor onSave={handleSave} loading={loading} />
    </div>
  );
};