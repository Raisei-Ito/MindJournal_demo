# Mind Journal - マインドフルネス日記アプリ

![Mind Journal](https://img.shields.io/badge/React-18.0+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.0+-purple.svg)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)

Mind Journalは、日々の感情や体験を記録し、マインドフルネスを実践するためのWebアプリケーションです。直感的なUIで感情の変化を追跡し、内省と自己理解を深めることができます。

## ✨ 主な機能

### 📝 日記機能
- **日記の作成・編集・削除**: リッチテキストエディタで自由に日記を記録
- **感情スコア**: 1-10の範囲で感情レベルを記録
- **タグ機能**: カテゴリー別に日記を整理
- **検索機能**: タイトル・内容・タグから日記を検索

### 📊 ダッシュボード
- **感情トレンド**: 感情の変化をグラフで可視化
- **統計情報**: 総日記数、平均感情スコア、連続記録日数
- **よく使うタグ**: 頻繁に使用するタグの表示
- **クイックアクション**: 新しい日記作成や既存の日記閲覧

### 📅 カレンダー機能
- **イベント管理**: 予定の作成・編集・削除
- **通知設定**: カスタマイズ可能な通知機能
- **終日イベント**: 一日中の予定にも対応

### 👤 ユーザー管理
- **認証システム**: Supabase Authによる安全なログイン
- **プロフィール管理**: ユーザー情報の編集
- **設定**: テーマ、言語、通知設定のカスタマイズ
- **データエクスポート**: 日記データのバックアップ機能

## 🛠️ 使用技術

### フロントエンド
- **React 18** - モダンなUIライブラリ
- **TypeScript** - 型安全な開発
- **Vite** - 高速なビルドツール
- **Tailwind CSS** - ユーティリティファーストのCSSフレームワーク
- **Framer Motion** - スムーズなアニメーション
- **React Hook Form** - フォーム管理
- **React Hot Toast** - 通知システム
- **Lucide React** - アイコンライブラリ
- **date-fns** - 日付操作ライブラリ

### バックエンド・データベース
- **Supabase** - BaaS（Backend as a Service）
- **PostgreSQL** - リレーショナルデータベース
- **Row Level Security (RLS)** - データセキュリティ
- **Real-time subscriptions** - リアルタイム更新

### 開発ツール
- **ESLint** - コード品質チェック
- **PostCSS** - CSS処理
- **Git** - バージョン管理

## 🚀 セットアップ

### 前提条件
- Node.js 18.0 以上
- npm または yarn
- Supabaseアカウント

### 1. リポジトリのクローン

```bash
git clone https://github.com/your-username/mind-journal.git
cd mind-journal/project
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

プロジェクトルートに `.env` ファイルを作成し、以下の変数を設定：

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Supabaseの設定

#### データベーススキーマの作成

```sql
-- journal_entriesテーブル
CREATE TABLE journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  emotion_score integer NOT NULL CHECK (emotion_score >= 1 AND emotion_score <= 10),
  tags text[] DEFAULT '{}',
  ai_analysis jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- eventsテーブル
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  location text DEFAULT '',
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  all_day boolean DEFAULT false,
  notification_enabled boolean DEFAULT true,
  notification_minutes integer DEFAULT 15,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- user_settingsテーブル
CREATE TABLE user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  theme text DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
  language text DEFAULT 'ja' CHECK (language IN ('ja', 'en')),
  notifications_enabled boolean DEFAULT true,
  email_notifications boolean DEFAULT true,
  default_notification_minutes integer DEFAULT 15,
  timezone text DEFAULT 'Asia/Tokyo',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### Row Level Security (RLS) ポリシーの設定

```sql
-- RLSを有効化
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- journal_entriesのポリシー
CREATE POLICY "Users can read own journal entries" ON journal_entries
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries" ON journal_entries
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries" ON journal_entries
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries" ON journal_entries
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 他のテーブルにも同様のポリシーを適用
```

### 5. アプリケーションの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開いてアプリケーションにアクセスできます。

## 📱 使用方法

### 初回ログイン
1. アプリケーションにアクセス
2. 「新規登録」でアカウントを作成
3. メール認証を完了
4. ログインしてダッシュボードにアクセス

### 日記の作成
1. ダッシュボードの「新しい日記」をクリック
2. タイトルと内容を入力
3. 感情スコア（1-10）を設定
4. 関連するタグを追加
5. 「日記を保存」をクリック

### 日記の管理
1. 「私の日記」ページで過去の日記を閲覧
2. 検索機能でテキストやタグから日記を検索
3. 日記カードの「...」メニューから編集・削除

### カレンダー機能
1. カレンダーページでイベントを作成
2. 日付をクリックして新しい予定を追加
3. 通知設定をカスタマイズ

## 🏗️ プロジェクト構造

```
project/
├── src/
│   ├── components/          # Reactコンポーネント
│   │   ├── auth/           # 認証関連
│   │   ├── calendar/       # カレンダー機能
│   │   ├── dashboard/      # ダッシュボード
│   │   ├── entries/        # 日記一覧・カード
│   │   ├── journal/        # 日記エディター
│   │   ├── layout/         # レイアウト
│   │   ├── settings/       # 設定画面
│   │   └── ui/             # 共通UIコンポーネント
│   ├── contexts/           # Reactコンテキスト
│   ├── lib/                # ユーティリティ・API
│   ├── pages/              # ページコンポーネント
│   ├── types/              # TypeScript型定義
│   └── styles/             # スタイルファイル
├── supabase/
│   └── migrations/         # データベースマイグレーション
├── public/                 # 静的ファイル
└── package.json           # 依存関係とスクリプト
```

## 🔧 開発

### 利用可能なスクリプト

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# ビルドのプレビュー
npm run preview

# ESLintによるコードチェック
npm run lint
```

### コーディング規約
- **ESLint設定**: TypeScriptとReactの推奨ルールを使用
- **命名規約**: キャメルケース（変数・関数）、パスカルケース（コンポーネント）
- **コンポーネント設計**: 単一責任の原則、再利用可能性を重視
- **型安全性**: TypeScriptの厳格な型チェックを活用

## 🤝 コントリビューション

プロジェクトへの貢献を歓迎します！

1. フォークを作成
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 🆘 サポート

問題が発生した場合は、[Issues](https://github.com/your-username/mind-journal/issues) で報告してください。

## 🙏 謝辞

- [Supabase](https://supabase.com/) - 素晴らしいBaaSプラットフォーム
- [Tailwind CSS](https://tailwindcss.com/) - 美しいデザインシステム
- [Lucide](https://lucide.dev/) - 高品質なアイコンライブラリ
- [Framer Motion](https://www.framer.com/motion/) - 滑らかなアニメーション

---

**Mind Journal** - あなたの内なる声に耳を傾け、マインドフルな生活を送るためのパートナー 🌱 