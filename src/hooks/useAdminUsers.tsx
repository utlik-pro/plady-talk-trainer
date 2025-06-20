
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { adminUsersService } from '@/services/adminUsersService';
import { User } from '@/types/user';

export const useAdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersData = await adminUsersService.fetchUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить данные пользователей",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'free' | 'premium') => {
    try {
      await adminUsersService.updateUserRole(userId, newRole);
      
      toast({
        title: "Успешно",
        description: `Роль пользователя изменена на ${newRole}`
      });

      fetchUsers();
    } catch (error) {
      console.error('Error in updateUserRole:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить роль пользователя",
        variant: "destructive"
      });
    }
  };

  const toggleUserBan = async (userId: string, currentBanStatus: boolean) => {
    try {
      await adminUsersService.toggleUserBan(userId, currentBanStatus);
      
      toast({
        title: "Успешно",
        description: currentBanStatus ? "Пользователь разблокирован" : "Пользователь заблокирован"
      });

      fetchUsers();
    } catch (error) {
      console.error('Error in toggleUserBan:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось изменить статус блокировки",
        variant: "destructive"
      });
    }
  };

  return {
    users,
    loading,
    fetchUsers,
    updateUserRole,
    toggleUserBan
  };
};
