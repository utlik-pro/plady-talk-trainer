
-- Создаем функцию для получения всех пользователей в админке
CREATE OR REPLACE FUNCTION get_all_users_admin()
RETURNS TABLE (
  id uuid,
  email text,
  role text,
  is_banned boolean,
  subscription_expires_at timestamp with time zone,
  total_spent numeric,
  elevenlabs_usage_count integer,
  registration_date timestamp with time zone,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.email,
    p.role,
    p.is_banned,
    p.subscription_expires_at,
    p.total_spent,
    p.elevenlabs_usage_count,
    p.registration_date,
    p.created_at,
    p.updated_at
  FROM profiles p
  ORDER BY p.registration_date DESC;
$$;

-- Даем права на выполнение этой функции
GRANT EXECUTE ON FUNCTION get_all_users_admin() TO anon;
GRANT EXECUTE ON FUNCTION get_all_users_admin() TO authenticated;
