
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { revenueService } from '@/services/revenueService';
import { User } from '@/types/user';

interface UserStats {
  totalUsers: number;
  totalMessages: number;
  totalSpent: number;
  activeSubscriptions: number;
  totalRevenue: number;
  netProfit: number;
}

interface ElevenLabsUsage {
  id: string;
  user_id: string;
  characters_count: number;
  cost: number;
  created_at: string;
  session_id: string | null;
  conversation_id: string | null;
  metadata: any;
}

export const useAdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [elevenLabsUsage, setElevenLabsUsage] = useState<ElevenLabsUsage[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    totalMessages: 0,
    totalSpent: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    netProfit: 0
  });
  const [loading, setLoading] = useState(false);

  const fetchElevenLabsUsage = async () => {
    try {
      console.log('Fetching ElevenLabs usage...');
      const { data, error } = await supabase
        .from('elevenlabs_usage')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching ElevenLabs usage:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить данные ElevenLabs",
          variant: "destructive"
        });
        return;
      }

      console.log('ElevenLabs usage data:', data);
      setElevenLabsUsage(data || []);
    } catch (error) {
      console.error('Error in fetchElevenLabsUsage:', error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      console.log('Fetching users...');
      
      // Получаем пользователей с дополнительной информацией о сессиях
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('registration_date', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return;
      }

      console.log('Profiles data:', profiles);

      // Получаем статистику сессий для каждого пользователя
      const usersWithStats = await Promise.all(
        (profiles || []).map(async (profile) => {
          // Количество сессий
          const { count: sessionsCount } = await supabase
            .from('conversation_sessions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.id);

          // Количество сообщений - исправляем запрос
          const { data: userSessions } = await supabase
            .from('conversation_sessions')
            .select('id')
            .eq('user_id', profile.id);

          let messagesCount = 0;
          if (userSessions && userSessions.length > 0) {
            const sessionIds = userSessions.map(session => session.id);
            const { count } = await supabase
              .from('conversation_messages')
              .select('*', { count: 'exact', head: true })
              .in('session_id', sessionIds);
            messagesCount = count || 0;
          }

          // Последняя активность
          const { data: lastSession } = await supabase
            .from('conversation_sessions')
            .select('created_at')
            .eq('user_id', profile.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          return {
            ...profile,
            total_sessions: sessionsCount || 0,
            total_conversations: messagesCount,
            last_activity: lastSession?.created_at || null
          };
        })
      );

      setUsers(usersWithStats);

      const totalUsers = usersWithStats.length;
      const totalSpent = usersWithStats.reduce((sum, user) => sum + (user.total_spent || 0), 0);
      const activeSubscriptions = usersWithStats.filter(user => 
        user.role === 'premium' && 
        (!user.subscription_expires_at || new Date(user.subscription_expires_at) > new Date())
      ).length;

      // Получаем общее количество сообщений
      const totalMessages = usersWithStats.reduce((sum, user) => sum + user.total_conversations, 0);

      const totalRevenue = await revenueService.getTotalRevenue();
      const netProfit = totalRevenue - totalSpent;

      setStats({
        totalUsers,
        totalMessages,
        totalSpent,
        activeSubscriptions,
        totalRevenue,
        netProfit
      });

      console.log('Stats calculated:', {
        totalUsers,
        totalMessages,
        totalSpent,
        totalRevenue,
        netProfit
      });

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
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: newRole,
          subscription_expires_at: newRole === 'premium' 
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
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

      if (newRole === 'premium') {
        await revenueService.addSubscriptionRevenue(userId, 9.99, 'premium', 'admin_upgrade');
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

  useEffect(() => {
    fetchUsers();
    fetchElevenLabsUsage();
  }, []);

  return {
    users,
    elevenLabsUsage,
    stats,
    loading,
    updateUserRole,
    toggleUserBan,
    fetchUsers
  };
};
