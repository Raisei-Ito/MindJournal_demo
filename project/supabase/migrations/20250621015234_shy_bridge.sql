/*
  # カレンダーイベントとユーザー設定テーブルの追加

  1. 新しいテーブル
    - `events`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `title` (text, required)
      - `description` (text, optional)
      - `location` (text, optional)
      - `start_date` (timestamp with timezone)
      - `end_date` (timestamp with timezone)
      - `all_day` (boolean, default false)
      - `notification_enabled` (boolean, default true)
      - `notification_minutes` (integer, default 15)
      - `created_at` (timestamp with timezone)
      - `updated_at` (timestamp with timezone)

    - `user_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `theme` (text, default 'light')
      - `language` (text, default 'ja')
      - `notifications_enabled` (boolean, default true)
      - `email_notifications` (boolean, default true)
      - `default_notification_minutes` (integer, default 15)
      - `timezone` (text, default 'Asia/Tokyo')
      - `created_at` (timestamp with timezone)
      - `updated_at` (timestamp with timezone)

  2. セキュリティ
    - 両テーブルでRLSを有効化
    - 認証ユーザーが自分のデータのみアクセス可能なポリシーを追加

  3. インデックス
    - パフォーマンス向上のためのインデックスを追加
*/

-- イベントテーブルの作成
CREATE TABLE IF NOT EXISTS events (
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

-- ユーザー設定テーブルの作成
CREATE TABLE IF NOT EXISTS user_settings (
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

-- RLSを有効化
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- イベントテーブルのポリシー
CREATE POLICY "Users can read own events"
  ON events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own events"
  ON events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ユーザー設定テーブルのポリシー
CREATE POLICY "Users can read own settings"
  ON user_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own settings"
  ON user_settings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- updated_atトリガーの追加
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- インデックスの作成
CREATE INDEX IF NOT EXISTS events_user_id_idx ON events(user_id);
CREATE INDEX IF NOT EXISTS events_start_date_idx ON events(start_date);
CREATE INDEX IF NOT EXISTS events_end_date_idx ON events(end_date);
CREATE INDEX IF NOT EXISTS user_settings_user_id_idx ON user_settings(user_id);