
import { Button } from '@/components/ui/button';

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

interface UserDetailViewProps {
  user: User;
  formatDate: (dateString: string) => string;
  onBack: () => void;
  onLogout: () => void;
  onUpdateRole: (userId: string, newRole: 'free' | 'premium') => void;
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

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-6">Пользователь: {user.email}</h1>
          
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
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-medium text-gray-700">Потрачено:</label>
                <p className="text-lg">${user.total_spent?.toFixed(4) || '0.0000'}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">ElevenLabs использований:</label>
                <p className="text-lg">{user.elevenlabs_usage_count || 0}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Дата регистрации:</label>
                <p className="text-lg">{formatDate(user.registration_date)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <Button
                onClick={() => onUpdateRole(user.id, user.role === 'premium' ? 'free' : 'premium')}
                variant={user.role === 'premium' ? 'destructive' : 'default'}
              >
                {user.role === 'premium' ? 'Понизить до Free' : 'Повысить до Premium'}
              </Button>
              
              <Button
                onClick={() => onToggleBan(user.id, user.is_banned)}
                variant={user.is_banned ? 'default' : 'destructive'}
              >
                {user.is_banned ? 'Разблокировать' : 'Заблокировать'}
              </Button>
            </div>

            {user.subscription_expires_at && (
              <div>
                <label className="font-medium text-gray-700">Подписка истекает:</label>
                <p className="text-lg">{formatDate(user.subscription_expires_at)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
