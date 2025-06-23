import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Tag, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { EmotionSlider } from './EmotionSlider';
import { TagInput } from './TagInput';
import type { EmotionScale } from '../../types';
import { motion } from 'framer-motion';

const journalSchema = z.object({
  title: z.string().min(1, 'タイトルを入力してください').trim(),
  content: z.string().min(10, '内容は10文字以上で入力してください').trim(),
});

type JournalData = z.infer<typeof journalSchema>;

interface JournalEditorProps {
  onSave: (data: JournalData & { emotion_score: EmotionScale; tags: string[] }) => Promise<void>;
  loading?: boolean;
  initialData?: Partial<JournalData & { emotion_score: EmotionScale; tags: string[] }>;
}

export const JournalEditor: React.FC<JournalEditorProps> = ({
  onSave,
  loading = false,
  initialData,
}) => {
  const [emotionScore, setEmotionScore] = useState<EmotionScale>(initialData?.emotion_score || 5);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid, isDirty }, 
    reset,
    watch,
    trigger
  } = useForm<JournalData>({
    resolver: zodResolver(journalSchema),
    mode: 'onBlur', // バリデーションタイミングを変更
    reValidateMode: 'onChange',
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
    },
  });

  // フォームの値を監視
  const watchedTitle = watch('title');
  const watchedContent = watch('content');

  const handleSave = async (data: JournalData) => {
    console.log('Form submission data:', {
      title: data.title,
      content: data.content,
      titleLength: data.title?.length || 0,
      contentLength: data.content?.length || 0,
      emotionScore,
      tags,
      isValid,
      errors
    });
    
    // 手動でバリデーションを実行
    const isFormValid = await trigger();
    if (!isFormValid) {
      console.error('Form validation failed');
      return;
    }
    
    try {
      await onSave({
        title: data.title.trim(),
        content: data.content.trim(),
        emotion_score: emotionScore,
        tags,
      });
      
      // 保存成功後にフォームをリセット
      reset({
        title: '',
        content: '',
      });
      setEmotionScore(5);
      setTags([]);
    } catch (error) {
      console.error('Save error in JournalEditor:', error);
      // エラーはWriteEntryコンポーネントで処理される
    }
  };

  // フォームが有効かどうかを判定
  const isFormValid = watchedTitle && watchedTitle.trim().length > 0 && 
                     watchedContent && watchedContent.trim().length >= 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="p-8">
        <div className="flex items-center mb-6">
          <Calendar className="w-6 h-6 text-primary-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">
            {new Date().toLocaleDateString('ja-JP', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </h2>
        </div>

        <form onSubmit={handleSubmit(handleSave)} className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              今日はどんなことがありましたか？
            </label>
            <input
              type="text"
              placeholder="日記のタイトルを入力してください..."
              {...register('title')}
              className={`
                block w-full rounded-lg border-gray-300 shadow-sm
                focus:border-primary-500 focus:ring-primary-500
                pl-3 pr-3 py-2
                ${errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
              `}
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
            )}
            <div className="text-xs text-gray-500 mt-1">
              入力文字数: {watchedTitle?.length || 0}文字
            </div>
          </div>

          <EmotionSlider
            value={emotionScore}
            onChange={setEmotionScore}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              あなたの想い
            </label>
            <textarea
              {...register('content')}
              rows={12}
              className={`
                block w-full rounded-lg border-gray-300 shadow-sm 
                focus:border-primary-500 focus:ring-primary-500 resize-none
                ${errors.content ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
              `}
              placeholder="今日の出来事、感じたこと、考えたことを自由に書いてください。ここはあなただけの安全な場所です。"
            />
            {errors.content && (
              <p className="text-sm text-red-600">{errors.content.message}</p>
            )}
            <div className="text-xs text-gray-500">
              入力文字数: {watchedContent?.length || 0}文字 (最低10文字必要)
            </div>
          </div>

          <TagInput
            tags={tags}
            onChange={setTags}
            icon={<Tag className="w-4 h-4" />}
          />

          {/* デバッグ情報の表示 */}
          <div className="bg-gray-50 p-4 rounded-lg text-xs text-gray-600">
            <p><strong>フォーム状態:</strong></p>
            <p>タイトル: "{watchedTitle}" ({watchedTitle?.length || 0}文字)</p>
            <p>内容: {watchedContent?.length || 0}文字</p>
            <p>React Hook Form isValid: {isValid ? '✓ 有効' : '✗ 無効'}</p>
            <p>カスタムバリデーション: {isFormValid ? '✓ 有効' : '✗ 無効'}</p>
            <p>isDirty: {isDirty ? 'true' : 'false'}</p>
            <p>エラー: {Object.keys(errors).length > 0 ? JSON.stringify(errors) : 'なし'}</p>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="flex items-center"
              disabled={loading || !isFormValid}
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? '保存中...' : '日記を保存'}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};