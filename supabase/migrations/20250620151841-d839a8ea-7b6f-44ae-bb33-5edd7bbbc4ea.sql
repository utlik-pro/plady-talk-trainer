
-- Создаем таблицу для отслеживания доходов с подписок
CREATE TABLE public.subscription_revenue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  subscription_type TEXT NOT NULL DEFAULT 'premium',
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для таблицы доходов
ALTER TABLE public.subscription_revenue ENABLE ROW LEVEL SECURITY;

-- Создаем политику для доступа только админов (пока что открытый доступ для тестирования)
CREATE POLICY "Allow all access to subscription_revenue" 
  ON public.subscription_revenue 
  FOR ALL 
  USING (true);

-- Обновляем таблицу elevenlabs_usage для лучшего отслеживания
ALTER TABLE public.elevenlabs_usage 
ADD COLUMN IF NOT EXISTS conversation_id TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB;
