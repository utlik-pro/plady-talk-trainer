
-- Создаем таблицу для админов
CREATE TABLE public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Вставляем админа по умолчанию (логин: admin, пароль: admin)
INSERT INTO public.admins (username, password_hash) 
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Добавляем поля для управления пользователями
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS total_spent DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS elevenlabs_usage_count INTEGER DEFAULT 0;

-- Создаем таблицу для отслеживания использования ElevenLabs
CREATE TABLE public.elevenlabs_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  session_id UUID REFERENCES public.conversation_sessions(id),
  characters_count INTEGER NOT NULL DEFAULT 0,
  cost DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для админской таблицы
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elevenlabs_usage ENABLE ROW LEVEL SECURITY;

-- Политики для elevenlabs_usage
CREATE POLICY "Users can view their own usage" 
  ON public.elevenlabs_usage 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage" 
  ON public.elevenlabs_usage 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
