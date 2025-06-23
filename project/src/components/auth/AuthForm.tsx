import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, Heart, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const signInSchema = z.object({
  email: z.string().min(1, 'メールアドレスを入力してください').email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください').min(6, 'パスワードは6文字以上で入力してください'),
});

const signUpSchema = z.object({
  fullName: z.string().min(1, '氏名を入力してください').min(2, '氏名は2文字以上で入力してください'),
  email: z.string().min(1, 'メールアドレスを入力してください').email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください').min(6, 'パスワードは6文字以上で入力してください'),
  confirmPassword: z.string().min(1, 'パスワード確認を入力してください'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "パスワードが一致しません",
  path: ["confirmPassword"],
});

type SignInData = z.infer<typeof signInSchema>;
type SignUpData = z.infer<typeof signUpSchema>;

export const AuthForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const { signIn, signUp } = useAuth();

  const signInForm = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signUpForm = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleSignIn = async (data: SignInData) => {
    setLoading(true);
    setDebugInfo('サインイン処理を開始...');
    
    try {
      console.log('Sign in attempt:', { email: data.email });
      setDebugInfo('認証サーバーに接続中...');
      
      await signIn(data.email, data.password);
      setDebugInfo('サインイン成功！');
      toast.success('おかえりなさい！');
    } catch (error) {
      console.error('Sign in error:', error);
      const errorMessage = error instanceof Error ? error.message : 'サインインに失敗しました';
      setDebugInfo(`エラー: ${errorMessage}`);
      
      if (errorMessage.includes('Invalid login credentials')) {
        toast.error('メールアドレスまたはパスワードが正しくありません');
      } else if (errorMessage.includes('Email not confirmed')) {
        toast.error('メールアドレスの確認が完了していません');
      } else if (errorMessage.includes('Too many requests')) {
        toast.error('リクエストが多すぎます。しばらく待ってから再試行してください');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (data: SignUpData) => {
    setLoading(true);
    setDebugInfo('アカウント作成処理を開始...');
    
    try {
      console.log('Sign up attempt:', { 
        email: data.email, 
        fullName: data.fullName,
        passwordLength: data.password.length 
      });
      
      setDebugInfo('Supabaseに接続中...');
      
      await signUp(data.email, data.password, data.fullName);
      setDebugInfo('アカウント作成成功！');
      toast.success('アカウントが作成されました！');
    } catch (error) {
      console.error('Sign up error:', error);
      const errorMessage = error instanceof Error ? error.message : 'アカウント作成に失敗しました';
      setDebugInfo(`エラー: ${errorMessage}`);
      
      if (errorMessage.includes('User already registered')) {
        toast.error('このメールアドレスは既に登録されています');
      } else if (errorMessage.includes('Password should be at least 6 characters')) {
        toast.error('パスワードは6文字以上で入力してください');
      } else if (errorMessage.includes('Unable to validate email address')) {
        toast.error('メールアドレスの形式が正しくありません');
      } else if (errorMessage.includes('fetch')) {
        toast.error('ネットワーク接続を確認してください。Supabaseの設定が必要な可能性があります。');
        setDebugInfo('Supabase接続エラー: 右上の「Connect to Supabase」ボタンをクリックしてください');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const checkSupabaseConnection = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return {
        connected: false,
        message: 'Supabase環境変数が設定されていません'
      };
    }
    
    return {
      connected: true,
      message: 'Supabase設定済み'
    };
  };

  const connectionStatus = checkSupabaseConnection();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <Heart className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {isSignUp ? 'MindJournalに参加' : 'おかえりなさい'}
          </h2>
          <p className="mt-2 text-gray-600">
            {isSignUp 
              ? '感情の健康への旅を始めましょう' 
              : 'マインドフルネスの旅を続けましょう'
            }
          </p>
        </div>

        {/* 接続状態の表示 */}
        <div className={`p-3 rounded-lg flex items-center ${
          connectionStatus.connected 
            ? 'bg-green-50 text-green-800' 
            : 'bg-yellow-50 text-yellow-800'
        }`}>
          {connectionStatus.connected ? (
            <CheckCircle className="w-4 h-4 mr-2" />
          ) : (
            <AlertCircle className="w-4 h-4 mr-2" />
          )}
          <span className="text-sm">{connectionStatus.message}</span>
        </div>

        <Card className="p-8">
          {isSignUp ? (
            <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  氏名
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="山田太郎"
                    {...signUpForm.register('fullName')}
                    className={`
                      block w-full rounded-lg border-gray-300 shadow-sm
                      focus:border-primary-500 focus:ring-primary-500
                      pl-10 pr-3 py-2
                      ${signUpForm.formState.errors.fullName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                    `}
                  />
                </div>
                {signUpForm.formState.errors.fullName && (
                  <p className="text-sm text-red-600 mt-1">{signUpForm.formState.errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="example@email.com"
                    {...signUpForm.register('email')}
                    className={`
                      block w-full rounded-lg border-gray-300 shadow-sm
                      focus:border-primary-500 focus:ring-primary-500
                      pl-10 pr-3 py-2
                      ${signUpForm.formState.errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                    `}
                  />
                </div>
                {signUpForm.formState.errors.email && (
                  <p className="text-sm text-red-600 mt-1">{signUpForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  パスワード
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="6文字以上"
                    {...signUpForm.register('password')}
                    className={`
                      block w-full rounded-lg border-gray-300 shadow-sm
                      focus:border-primary-500 focus:ring-primary-500
                      pl-10 pr-3 py-2
                      ${signUpForm.formState.errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                    `}
                  />
                </div>
                {signUpForm.formState.errors.password && (
                  <p className="text-sm text-red-600 mt-1">{signUpForm.formState.errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  パスワード確認
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="パスワードを再入力"
                    {...signUpForm.register('confirmPassword')}
                    className={`
                      block w-full rounded-lg border-gray-300 shadow-sm
                      focus:border-primary-500 focus:ring-primary-500
                      pl-10 pr-3 py-2
                      ${signUpForm.formState.errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                    `}
                  />
                </div>
                {signUpForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">{signUpForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={loading}
                disabled={!connectionStatus.connected}
              >
                アカウント作成
              </Button>
            </form>
          ) : (
            <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="example@email.com"
                    {...signInForm.register('email')}
                    className={`
                      block w-full rounded-lg border-gray-300 shadow-sm
                      focus:border-primary-500 focus:ring-primary-500
                      pl-10 pr-3 py-2
                      ${signInForm.formState.errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                    `}
                  />
                </div>
                {signInForm.formState.errors.email && (
                  <p className="text-sm text-red-600 mt-1">{signInForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  パスワード
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="パスワード"
                    {...signInForm.register('password')}
                    className={`
                      block w-full rounded-lg border-gray-300 shadow-sm
                      focus:border-primary-500 focus:ring-primary-500
                      pl-10 pr-3 py-2
                      ${signInForm.formState.errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                    `}
                  />
                </div>
                {signInForm.formState.errors.password && (
                  <p className="text-sm text-red-600 mt-1">{signInForm.formState.errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={loading}
                disabled={!connectionStatus.connected}
              >
                サインイン
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              {isSignUp 
                ? 'すでにアカウントをお持ちですか？ サインイン' 
                : 'アカウントをお持ちでない方は こちら'
              }
            </button>
          </div>

          {/* デバッグ情報の表示 */}
          {debugInfo && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>状態:</strong> {debugInfo}
              </p>
            </div>
          )}
        </Card>

        {/* 使用方法の説明 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            セットアップ手順
          </h3>
          <ol className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="bg-primary-100 text-primary-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">1</span>
              画面右上の「Connect to Supabase」ボタンをクリック
            </li>
            <li className="flex items-start">
              <span className="bg-primary-100 text-primary-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">2</span>
              Supabaseプロジェクトの設定を完了
            </li>
            <li className="flex items-start">
              <span className="bg-primary-100 text-primary-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">3</span>
              アカウント作成またはサインインを実行
            </li>
          </ol>
        </Card>
      </div>
    </div>
  );
};