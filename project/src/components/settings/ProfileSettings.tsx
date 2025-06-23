import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Save } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { supabase } from '../../lib/supabase';
import type { User as UserType } from '../../types';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  full_name: z.string().min(1, '氏名を入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
});

type ProfileData = z.infer<typeof profileSchema>;

interface ProfileSettingsProps {
  user: UserType | null;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user }) => {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.user_metadata?.full_name || '',
      email: user?.email || '',
    },
  });

  const handleUpdateProfile = async (data: ProfileData) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: data.email,
        data: {
          full_name: data.full_name,
        },
      });

      if (error) throw error;

      toast.success('プロフィールを更新しました');
    } catch (error) {
      console.error('プロフィール更新に失敗しました:', error);
      toast.error('プロフィール更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center mb-6">
        <User className="w-6 h-6 text-primary-600 mr-3" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">プロフィール設定</h2>
          <p className="text-gray-600 text-sm">アカウント情報を管理します</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-6">
        <Input
          label="氏名"
          placeholder="山田太郎"
          {...register('full_name')}
          error={errors.full_name?.message}
          icon={<User className="w-4 h-4" />}
        />

        <Input
          label="メールアドレス"
          type="email"
          placeholder="example@email.com"
          {...register('email')}
          error={errors.email?.message}
          icon={<Mail className="w-4 h-4" />}
        />

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>注意:</strong> メールアドレスを変更すると、新しいメールアドレスに確認メールが送信されます。
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            loading={loading}
            className="flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            変更を保存
          </Button>
        </div>
      </form>
    </Card>
  );
};