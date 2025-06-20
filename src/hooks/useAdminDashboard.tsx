
import { useEffect } from 'react';
import { useAdminUsers } from './useAdminUsers';
import { useAdminElevenLabs } from './useAdminElevenLabs';
import { useAdminStats } from './useAdminStats';

export const useAdminDashboard = () => {
  const { users, loading, fetchUsers, updateUserRole, toggleUserBan } = useAdminUsers();
  const { elevenLabsUsage, fetchElevenLabsUsage } = useAdminElevenLabs();
  const { stats, calculateStats } = useAdminStats();

  useEffect(() => {
    fetchUsers();
    fetchElevenLabsUsage();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      calculateStats(users);
    }
  }, [users]);

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
