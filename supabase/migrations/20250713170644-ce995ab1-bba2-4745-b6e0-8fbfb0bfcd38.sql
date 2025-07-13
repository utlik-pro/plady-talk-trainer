-- Создаем функцию для проверки прав администратора
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  -- Проверяем есть ли у текущего пользователя запись в таблице admins
  RETURN EXISTS (
    SELECT 1 FROM public.admins 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Добавляем политику для администраторов на обновление профилей
CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());