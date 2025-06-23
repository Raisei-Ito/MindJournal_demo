import React from 'react';
import { Shield, Lock, Eye, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const PrivacySettings: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center mb-6">
        <Shield className="w-6 h-6 text-primary-600 mr-3" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">プライバシー設定</h2>
          <p className="text-gray-600 text-sm">データの保護とプライバシー管理</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Lock className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="font-medium text-green-900">データの暗号化</h3>
          </div>
          <p className="text-sm text-green-800">
            あなたの日記データは最高レベルの暗号化技術で保護されています。
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Eye className="w-5 h-5 text-gray-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">データの可視性</h4>
                <p className="text-sm text-gray-600">あなたのデータは他のユーザーには表示されません</p>
              </div>
            </div>
            <div className="text-green-600 font-medium">プライベート</div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-gray-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">アクセス制御</h4>
                <p className="text-sm text-gray-600">認証されたユーザーのみがデータにアクセス可能</p>
              </div>
            </div>
            <div className="text-green-600 font-medium">有効</div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">プライバシーポリシー</h4>
          <p className="text-sm text-blue-800 mb-3">
            私たちはあなたのプライバシーを最優先に考えています。以下の原則に従ってデータを管理しています：
          </p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• データの収集は必要最小限に留めています</li>
            <li>• 第三者とのデータ共有は行いません</li>
            <li>• データの削除要求にはすぐに対応します</li>
            <li>• セキュリティ対策を継続的に改善しています</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
            <h4 className="font-medium text-yellow-900">データの削除</h4>
          </div>
          <p className="text-sm text-yellow-800 mb-3">
            アカウントを削除すると、すべてのデータが完全に削除されます。この操作は取り消すことができません。
          </p>
          <Button
            variant="outline"
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            アカウントを削除
          </Button>
        </div>
      </div>
    </Card>
  );
};