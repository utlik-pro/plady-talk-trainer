
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User } from '@/types/user';
import { PaymentAmountDialog } from './PaymentAmountDialog';
import { UserElevenLabsUsage } from './UserElevenLabsUsage';

interface UserDetailViewProps {
  user: User;
  formatDate: (dateString: string) => string;
  onBack: () => void;
  onLogout: () => void;
  onUpdateRole: (userId: string, newRole: 'free' | 'premium', amount?: number) => void;
  onToggleBan: (userId: string, currentBanStatus: boolean) => void;
}

export const UserDetailView = ({ 
  user, 
  formatDate, 
  onBack, 
  onLogout, 
  onUpdateRole, 
  onToggleBan 
}: UserDetailViewProps) => {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  
  const averageMessagesPerSession = user.total_sessions > 0 
    ? Math.round(user.total_conversations / user.total_sessions) 
    : 0;

  const handleUpgradeToPremium = () => {
    setShowPaymentDialog(true);
  };

  const handlePaymentConfirm = (amount: number) => {
    onUpdateRole(user.id, 'premium', amount);
  };

  const handleDowngradeToFree = () => {
    onUpdateRole(user.id, 'free');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="ghost">
            ← Назад к списку
          </Button>
          <Button onClick={onLogout} variant="destructive">
            Выйти
          </Button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h1 className="text-2xl font-bold mb-6">Пользователь: {user.email}</h1>
          
          {/* Основная информация */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="font-medium text-gray-700">Email:</label>
                <p className="text-lg">{user.email}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Тариф:</label>
                <p className={`text-lg font-medium ${
                  user.role === 'premium' ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {user.role === 'premium' ? 'Premium' : 'Free'}
                </p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Статус:</label>
                <p className={`text-lg font-medium ${
                  user.is_banned ? 'text-red-600' : 'text-green-600'
                }`}>
                  {user.is_banned ? 'Заблокирован' : 'Активен'}
                </p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Дата регистрации:</label>
                <p className="text-lg">{formatDate(user.registration_date)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-medium text-gray-700">Потрачено (ElevenLabs):</label>
                <p className="text-lg text-red-600 font-semibold">${user.total_spent?.toFixed(4) || '0.0000'}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">ElevenLabs использований:</label>
                <p className="text-lg font-semibold text-purple-600">{user.elevenlabs_usage_count || 0}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Последняя активность:</label>
                <p className="text-lg">
                  {user.last_activity ? formatDate(user.last_activity) : 'Нет данных'}
                </p>
              </div>
              {user.subscription_expires_at && (
                <div>
                  <label className="font-medium text-gray-700">Подписка истекает:</label>
                  <p className="text-lg">{formatDate(user.subscription_expires_at)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Статистика активности */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-4">Статистика активности</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{user.total_sessions}</div>
                <div className="text-sm text-gray-600">Всего сессий</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{user.total_conversations}</div>
                <div className="text-sm text-gray-600">Всего сообщений</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{averageMessagesPerSession}</div>
                <div className="text-sm text-gray-600">Среднее сообщений/сессия</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{user.elevenlabs_usage_count}</div>
                <div className="text-sm text-gray-600">Голосовых сессий</div>
              </div>
            </div>
          </div>

          {/* Финансовая статистика */}
          <div className="bg-red-50 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-4 text-red-800">Финансовая статистика</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">${user.total_spent?.toFixed(4) || '0.0000'}</div>
                <div className="text-sm text-gray-600">Общие затраты</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  ${user.total_spent && user.elevenlabs_usage_count ? (user.total_spent / user.elevenlabs_usage_count).toFixed(4) : '0.0000'}
                </div>
                <div className="text-sm text-gray-600">Средняя стоимость/сессия</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {user.total_conversations && user.total_spent ? Math.round(user.total_conversations / (user.total_spent * 10000)) : 0}
                </div>
                <div className="text-sm text-gray-600">Сообщений на $0.01</div>
              </div>
            </div>
          </div>

          {/* Действия с пользователем */}
          <div className="space-y-4">
            <div className="flex gap-4">
              {user.role === 'premium' ? (
                <Button
                  onClick={handleDowngradeToFree}
                  variant="destructive"
                >
                  Понизить до Free
                </Button>
              ) : (
                <Button
                  onClick={handleUpgradeToPremium}
                  variant="default"
                >
                  Повысить до Premium
                </Button>
              )}
              
              <Button
                onClick={() => onToggleBan(user.id, user.is_banned)}
                variant={user.is_banned ? 'default' : 'destructive'}
              >
                {user.is_banned ? 'Разблокировать' : 'Заблокировать'}
              </Button>
            </div>
          </div>
        </div>

        {/* Детали использования ElevenLabs для этого пользователя */}
        <UserElevenLabsUsage userId={user.id} formatDate={formatDate} />

        <PaymentAmountDialog
          isOpen={showPaymentDialog}
          onClose={() => setShowPaymentDialog(false)}
          onConfirm={handlePaymentConfirm}
          userEmail={user.email}
        />
      </div>
    </div>
  );
};
