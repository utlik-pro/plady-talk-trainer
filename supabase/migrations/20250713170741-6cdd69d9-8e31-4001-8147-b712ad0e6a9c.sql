-- Создаем администратора в auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'c14f1a70-9f71-4dbe-8356-cd6b0af15e5c',
  'authenticated',
  'authenticated',
  'admin@plady.com',
  crypt('admin', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Создаем профиль для администратора
INSERT INTO public.profiles (
  id, 
  email, 
  role, 
  registration_date,
  is_banned,
  total_spent,
  elevenlabs_usage_count
) VALUES (
  'c14f1a70-9f71-4dbe-8356-cd6b0af15e5c',
  'admin@plady.com',
  'admin',
  NOW(),
  false,
  0.00,
  0
) ON CONFLICT (id) DO NOTHING;