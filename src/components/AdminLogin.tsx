
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Используем email и пароль для входа через Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@plady.com',
        password: 'admin'
      });

      if (error) {
        throw error;
      }

      // Проверяем что это администратор
      const { data: adminCheck } = await supabase
        .from('admins')
        .select('id')
        .eq('id', data.user?.id)
        .single();

      if (!adminCheck) {
        await supabase.auth.signOut();
        throw new Error('Нет прав администратора');
      }

      localStorage.setItem('admin_logged_in', 'true');
      onLogin();
      toast({
        title: "Успешный вход",
        description: "Добро пожаловать в админ панель"
      });
    } catch (error: any) {
      console.error('Admin login error:', error);
      toast({
        title: "Ошибка входа",
        description: error.message || "Неверные данные для входа",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-gray-800">Админ панель</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-center text-gray-600 mb-4">
            Нажмите кнопку для входа в админ панель
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </Button>
        </form>
      </div>
    </div>
  );
};
