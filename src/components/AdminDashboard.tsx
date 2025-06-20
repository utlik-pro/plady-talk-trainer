
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  role: string;
  is_banned: boolean;
  subscription_expires_at: string | null;
  total_spent: number;
  elevenlabs_usage_count: number;
  registration_date: string;
}

interface UserStats {
  totalUsers: number;
  totalMessages: number;
  totalSpent: number;
  activeSubscriptions: number;
}

export const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    totalMessages: 0,
    totalSpent: 0,
    activeSubscriptions: 0
  });
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('registration_date', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      setUsers(data || []);

      // Подсчитываем статистику
      const totalUsers = data?.length || 0;
      const totalSpent = data?.reduce((sum, user) => sum + (user.total_spent || 0), 0) || 0;
      const activeSubscriptions = data?.filter(user => 
        user.role === 'premium' && 
        (!user.subscription_expires_at || new Date(user.subscription_expires_at) > new Date())
      ).length || 0;

      // Получаем общее количество сообщений
      const { count: messageCount } = await supabase
        .from('conversation_messages')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers,
        totalMessages: messageCount || 0,
        totalSpent,
        activeSubscriptions
      });
    } catch (error) {
      console.error('Error in fetchUsers:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'free' | 'premium') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: newRole,
          subscription_expires_at: newRole === 'premium' 
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 дней
            : null
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating role:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось обновить роль пользователя",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Успешно",
        description: `Роль пользователя изменена на ${newRole}`
      });

      fetchUsers();
    } catch (error) {
      console.error('Error in updateUserRole:', error);
    }
  };

  const toggleUserBan = async (userId: string, currentBanStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_banned: !currentBanStatus })
        .eq('id', userId);

      if (error) {
        console.error('Error updating ban status:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось изменить статус блокировки",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Успешно",
        description: currentBanStatus ? "Пользователь разблокирован" : "Пользователь заблокирован"
      });

      fetchUsers();
    } catch (error) {
      console.error('Error in toggleUserBan:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    window.location.reload();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  if (selectedUser) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Button onClick={() => setSelectedUser(null)} variant="ghost">
              ← Назад к списку
            </Button>
            <Button onClick={handleLogout} variant="destructive">
              Выйти
            </Button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h1 className="text-2xl font-bold mb-6">Пользователь: {selectedUser.email}</h1>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="font-medium text-gray-700">Email:</label>
                  <p className="text-lg">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Тариф:</label>
                  <p className={`text-lg font-medium ${
                    selectedUser.role === 'premium' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {selectedUser.role === 'premium' ? 'Premium' : 'Free'}
                  </p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Статус:</label>
                  <p className={`text-lg font-medium ${
                    selectedUser.is_banned ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {selectedUser.is_banned ? 'Заблокирован' : 'Активен'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="font-medium text-gray-700">Потрачено:</label>
                  <p className="text-lg">${selectedUser.total_spent?.toFixed(2) || '0.00'}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">ElevenLabs использований:</label>
                  <p className="text-lg">{selectedUser.elevenlabs_usage_count || 0}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Дата регистрации:</label>
                  <p className="text-lg">{formatDate(selectedUser.registration_date)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  onClick={() => updateUserRole(selectedUser.id, selectedUser.role === 'premium' ? 'free' : 'premium')}
                  variant={selectedUser.role === 'premium' ? 'destructive' : 'default'}
                >
                  {selectedUser.role === 'premium' ? 'Понизить до Free' : 'Повысить до Premium'}
                </Button>
                
                <Button
                  onClick={() => toggleUserBan(selectedUser.id, selectedUser.is_banned)}
                  variant={selectedUser.is_banned ? 'default' : 'destructive'}
                >
                  {selectedUser.is_banned ? 'Разблокировать' : 'Заблокировать'}
                </Button>
              </div>

              {selectedUser.subscription_expires_at && (
                <div>
                  <label className="font-medium text-gray-700">Подписка истекает:</label>
                  <p className="text-lg">{formatDate(selectedUser.subscription_expires_at)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Админ панель</h1>
          <Button onClick={handleLogout} variant="destructive">
            Выйти
          </Button>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
            <div className="text-sm text-gray-600">Всего пользователей</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-green-600">{stats.totalMessages}</div>
            <div className="text-sm text-gray-600">Всего сообщений</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-purple-600">${stats.totalSpent.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Общие затраты</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-2xl font-bold text-orange-600">{stats.activeSubscriptions}</div>
            <div className="text-sm text-gray-600">Активные подписки</div>
          </div>
        </div>

        {/* Список пользователей */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Пользователи</h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">Загрузка...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Тариф</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Потрачено</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Регистрация</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'premium' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role === 'premium' ? 'Premium' : 'Free'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.is_banned 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.is_banned ? 'Заблокирован' : 'Активен'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${user.total_spent?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(user.registration_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button
                          onClick={() => setSelectedUser(user)}
                          variant="ghost"
                          size="sm"
                        >
                          Подробнее
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
