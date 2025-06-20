
import { supabase } from '@/integrations/supabase/client';
import { revenueService } from '@/services/revenueService';
import { User } from '@/types/user';
import { UserStats } from '@/types/admin';

export const adminStatsService = {
  async calculateUserStats(users: User[]): Promise<UserStats> {
    const totalUsers = users.length;
    const totalSpent = users.reduce((sum, user) => sum + (user.total_spent || 0), 0);
    const activeSubscriptions = users.filter(user => 
      user.role === 'premium' && 
      (!user.subscription_expires_at || new Date(user.subscription_expires_at) > new Date())
    ).length;

    const totalMessages = users.reduce((sum, user) => sum + user.total_conversations, 0);
    const totalRevenue = await revenueService.getTotalRevenue();
    const netProfit = totalRevenue - totalSpent;

    console.log('Stats calculated:', {
      totalUsers,
      totalMessages,
      totalSpent,
      totalRevenue,
      netProfit
    });

    return {
      totalUsers,
      totalMessages,
      totalSpent,
      activeSubscriptions,
      totalRevenue,
      netProfit
    };
  }
};
