
import { useState } from 'react';
import { AdminHeader } from './admin/AdminHeader';
import { FinancialStats } from './admin/FinancialStats';
import { UserStats } from './admin/UserStats';
import { ElevenLabsUsageTable } from './admin/ElevenLabsUsageTable';
import { UsersTable } from './admin/UsersTable';
import { UserDetailView } from './admin/UserDetailView';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';

interface User {
  id: string;
  email: string;
  role: string;
  is_banned: boolean;
  subscription_expires_at: string | null;
  total_spent: number;
  elevenlabs_usage_count: number;
  registration_date: string;
  total_sessions: number;
  total_conversations: number;
  last_activity: string | null;
}

export const AdminDashboard = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const {
    users,
    elevenLabsUsage,
    stats,
    loading,
    updateUserRole,
    toggleUserBan
  } = useAdminDashboard();

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    window.location.reload();
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  if (selectedUser) {
    return (
      <UserDetailView
        user={selectedUser}
        formatDate={formatDate}
        onBack={() => setSelectedUser(null)}
        onLogout={handleLogout}
        onUpdateRole={updateUserRole}
        onToggleBan={toggleUserBan}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <AdminHeader onLogout={handleLogout} />

        <FinancialStats
          totalRevenue={stats.totalRevenue}
          totalSpent={stats.totalSpent}
          netProfit={stats.netProfit}
        />

        <UserStats
          totalUsers={stats.totalUsers}
          totalMessages={stats.totalMessages}
          activeSubscriptions={stats.activeSubscriptions}
          elevenLabsUsageCount={elevenLabsUsage.length}
        />

        <ElevenLabsUsageTable
          usage={elevenLabsUsage}
          formatDate={formatDate}
        />

        <UsersTable
          users={users}
          loading={loading}
          formatDate={formatDate}
          onUserSelect={setSelectedUser}
        />
      </div>
    </div>
  );
};
