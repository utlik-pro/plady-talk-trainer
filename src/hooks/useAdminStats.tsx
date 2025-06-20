
import { useState } from 'react';
import { adminStatsService } from '@/services/adminStatsService';
import { User } from '@/types/user';
import { UserStats } from '@/types/admin';

export const useAdminStats = () => {
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    totalMessages: 0,
    totalSpent: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    netProfit: 0
  });

  const calculateStats = async (users: User[]) => {
    const calculatedStats = await adminStatsService.calculateUserStats(users);
    setStats(calculatedStats);
  };

  return {
    stats,
    calculateStats
  };
};
