
import { supabase } from '@/integrations/supabase/client';
import { revenueService } from '@/services/revenueService';
import { User } from '@/types/user';

export const adminUsersService = {
  async fetchUsers(): Promise<User[]> {
    console.log('Fetching users...');
    
    // Используем RPC функцию для получения всех пользователей с правами администратора
    const { data: profiles, error: profilesError } = await supabase
      .rpc('get_all_users_admin');

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      // Fallback к обычному запросу если RPC функция не работает
      const { data: fallbackProfiles, error: fallbackError } = await supabase
        .from('profiles')
        .select('*')
        .order('registration_date', { ascending: false });
      
      if (fallbackError) {
        console.error('Fallback error:', fallbackError);
        throw fallbackError;
      }
      
      console.log('Using fallback profiles data:', fallbackProfiles);
      return await this.enrichUsersWithStats(fallbackProfiles || []);
    }

    console.log('Profiles data from RPC:', profiles);
    return await this.enrichUsersWithStats(profiles || []);
  },

  async enrichUsersWithStats(profiles: any[]): Promise<User[]> {
    const usersWithStats = await Promise.all(
      profiles.map(async (profile) => {
        // Количество сессий
        const { count: sessionsCount } = await supabase
          .from('conversation_sessions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profile.id);

        // Количество сообщений
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

    return usersWithStats;
  },

  async updateUserRole(userId: string, newRole: 'free' | 'premium', paymentAmount?: number) {
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
      throw error;
    }

    // Если назначаем премиум и указана сумма оплаты, записываем доход
    if (newRole === 'premium' && paymentAmount) {
      await revenueService.addSubscriptionRevenue(userId, paymentAmount, 'premium', 'admin_upgrade');
    }
  },

  async toggleUserBan(userId: string, currentBanStatus: boolean) {
    const { error } = await supabase
      .from('profiles')
      .update({ is_banned: !currentBanStatus })
      .eq('id', userId);

    if (error) {
      console.error('Error updating ban status:', error);
      throw error;
    }
  }
};
