import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen } from 'lucide-react';
import { EntryCard } from '../components/entries/EntryCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { getJournalEntries, deleteJournalEntry } from '../lib/database';
import type { JournalEntry } from '../types';
import toast from 'react-hot-toast';

export const MyEntries: React.FC = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadEntries();
  }, [user]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredEntries(entries);
      return;
    }

    const filtered = entries.filter(entry =>
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setFilteredEntries(filtered);
  }, [searchQuery, entries]);

  const loadEntries = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userEntries = await getJournalEntries(user.id);
      setEntries(userEntries);
      setFilteredEntries(userEntries);
    } catch (error) {
      console.error('日記の読み込みに失敗しました:', error);
      toast.error('日記の読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      await deleteJournalEntry(entryId);
      toast.success('日記を削除しました');
      
      // ローカル状態を更新
      const updatedEntries = entries.filter(entry => entry.id !== entryId);
      setEntries(updatedEntries);
      setFilteredEntries(updatedEntries.filter(entry =>
        !searchQuery || 
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      ));
    } catch (error) {
      console.error('日記の削除に失敗しました:', error);
      toast.error('日記の削除に失敗しました');
    }
  };

  const handleEditEntry = (entry: JournalEntry) => {
    // TODO: 編集機能を実装
    console.log('編集:', entry);
    toast.info('編集機能は近日実装予定です');
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
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">私の日記</h1>
          <p className="text-gray-600 mt-1">
            {entries.length}件の日記があります
          </p>
        </div>

        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="flex-1 sm:w-80">
            <Input
              placeholder="日記を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            フィルター
          </Button>
        </div>
      </motion.div>

      {filteredEntries.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {entries.length === 0 ? 'まだ日記がありません' : '該当する日記が見つかりません'}
          </h3>
          <p className="text-gray-600 mb-6">
            {entries.length === 0 
              ? 'マインドフルネスの旅を始めるために、最初の日記を書いてみましょう。'
              : '検索条件を調整するか、検索をクリアしてすべての日記を表示してください。'
            }
          </p>
          {entries.length === 0 && (
            <Button>最初の日記を書く</Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <EntryCard 
                entry={entry} 
                onEdit={handleEditEntry}
                onDelete={handleDeleteEntry}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};