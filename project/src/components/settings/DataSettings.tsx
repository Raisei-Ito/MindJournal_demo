import React, { useState } from 'react';
import { Download, Upload, Database, FileText } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { getJournalEntries } from '../../lib/database';
import { getEvents } from '../../lib/events';
import type { User } from '../../types';
import toast from 'react-hot-toast';

interface DataSettingsProps {
  user: User | null;
}

export const DataSettings: React.FC<DataSettingsProps> = ({ user }) => {
  const [loading, setLoading] = useState(false);

  const handleExportData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // 日記データを取得
      const journalEntries = await getJournalEntries(user.id);
      
      // イベントデータを取得
      const events = await getEvents(user.id);

      // エクスポートデータを作成
      const exportData = {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name,
        },
        journal_entries: journalEntries,
        events: events,
        exported_at: new Date().toISOString(),
      };

      // JSONファイルとしてダウンロード
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mindjournal-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('データをエクスポートしました');
    } catch (error) {
      console.error('データエクスポートに失敗しました:', error);
      toast.error('データエクスポートに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            console.log('インポートデータ:', data);
            toast.success('データをインポートしました（開発中）');
          } catch (error) {
            toast.error('無効なファイル形式です');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <Card className="p-6">
      <div className="flex items-center mb-6">
        <Database className="w-6 h-6 text-primary-600 mr-3" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">データ管理</h2>
          <p className="text-gray-600 text-sm">データのバックアップとリストア</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-3">
              <Download className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-medium text-gray-900">データエクスポート</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              すべての日記とイベントデータをJSONファイルとしてダウンロードします。
            </p>
            <Button
              onClick={handleExportData}
              loading={loading}
              className="w-full flex items-center justify-center"
            >
              <Download className="w-4 h-4 mr-2" />
              データをエクスポート
            </Button>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-3">
              <Upload className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="font-medium text-gray-900">データインポート</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              以前にエクスポートしたデータファイルからデータを復元します。
            </p>
            <Button
              onClick={handleImportData}
              variant="outline"
              className="w-full flex items-center justify-center"
            >
              <Upload className="w-4 h-4 mr-2" />
              データをインポート
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <FileText className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="font-medium text-gray-900">エクスポート形式</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            エクスポートされるデータには以下が含まれます：
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 日記エントリー（タイトル、内容、感情スコア、タグ）</li>
            <li>• カレンダーイベント（予定、場所、通知設定）</li>
            <li>• ユーザー設定（テーマ、言語、通知設定）</li>
            <li>• メタデータ（作成日時、更新日時）</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">バックアップのベストプラクティス</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 定期的にデータをエクスポートしてバックアップを作成</li>
            <li>• エクスポートファイルは安全な場所に保管</li>
            <li>• 重要な変更を行う前にバックアップを作成</li>
            <li>• 複数の場所にバックアップを保存することを推奨</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-900 mb-2">注意事項</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• インポート機能は現在開発中です</li>
            <li>• エクスポートファイルには個人情報が含まれます</li>
            <li>• ファイルの取り扱いには十分注意してください</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};