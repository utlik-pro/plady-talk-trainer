
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useTrainingStats } from '@/hooks/useTrainingStats';
import { toast } from '@/hooks/use-toast';

interface ProfileScreenProps {
  onLogout: () => void;
}

export const ProfileScreen = ({ onLogout }: ProfileScreenProps) => {
  const { user, profile, logout } = useAuth();
  const { stats, loading: statsLoading } = useTrainingStats();

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  const handleUpgradeSubscription = () => {
    window.open('https://t.me/dmitryutlik', '_blank');
    toast({
      title: "Переход к оплате",
      description: "Открывается Telegram для оформления подписки"
    });
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}ч ${remainingMinutes}м`;
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-plady-light to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">Загрузка профиля...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-plady-light to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-plady-pink to-plady-purple p-6 text-white">
        <div className="text-center">
          <div className="text-4xl mb-2">👤</div>
          <h1 className="text-2xl font-bold">Профиль</h1>
          <p className="text-sm opacity-90">{profile.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-plady-purple mb-1">
                {stats.totalSessions}
              </div>
              <div className="text-sm text-gray-600">Сессий</div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-plady-pink mb-1">
                {statsLoading ? '...' : formatTime(stats.totalMinutes)}
              </div>
              <div className="text-sm text-gray-600">Время тренировок</div>
            </div>
          </div>
        </div>

        {/* Subscription Status */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold mb-4">Подписка</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                profile.role === 'premium' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {profile.role === 'premium' ? 'Premium' : 'Free'}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {profile.role === 'premium' 
                  ? 'Все функции доступны' 
                  : 'Ограниченный доступ'}
              </p>
            </div>
            {profile.role === 'free' && (
              <Button 
                onClick={handleUpgradeSubscription}
                size="sm"
                className="bg-gradient-to-r from-plady-pink to-plady-purple text-white"
              >
                Улучшить
              </Button>
            )}
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold mb-4">Информация об аккаунте</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{profile.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Дата регистрации:</span>
              <span className="font-medium">
                {formatDate(profile.registration_date)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Статус:</span>
              <span className={`font-medium ${
                profile.role === 'premium' ? 'text-green-600' : 'text-gray-600'
              }`}>
                {profile.role === 'premium' ? 'Премиум пользователь' : 'Бесплатный аккаунт'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Всего сообщений:</span>
              <span className="font-medium">{stats.totalMessages}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Потрачено на ElevenLabs:</span>
              <span className="font-medium">${(profile.total_spent || 0).toFixed(4)}</span>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold mb-4">Достижения</h2>
          <div className="space-y-3">
            <div className={`flex items-center space-x-3 ${stats.totalSessions >= 1 ? '' : 'opacity-50'}`}>
              <div className="text-2xl">🎯</div>
              <div>
                <div className="font-medium">Первые шаги</div>
                <div className="text-sm text-gray-600">Завершил первую тренировку</div>
              </div>
              {stats.totalSessions >= 1 && <div className="text-green-500 text-sm">✓</div>}
            </div>
            <div className={`flex items-center space-x-3 ${stats.totalSessions >= 5 ? '' : 'opacity-50'}`}>
              <div className="text-2xl">💪</div>
              <div>
                <div className="font-medium">Постоянство</div>
                <div className="text-sm text-gray-600">5 тренировок завершено</div>
              </div>
              {stats.totalSessions >= 5 && <div className="text-green-500 text-sm">✓</div>}
            </div>
            <div className={`flex items-center space-x-3 ${stats.totalSessions >= 10 ? '' : 'opacity-50'}`}>
              <div className="text-2xl">🏆</div>
              <div>
                <div className="font-medium">Мастер общения</div>
                <div className="text-sm text-gray-600">10 тренировок завершено</div>
              </div>
              {stats.totalSessions >= 10 && <div className="text-green-500 text-sm">✓</div>}
            </div>
          </div>
        </div>

        {/* Logout */}
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full"
        >
          Выйти из аккаунта
        </Button>
      </div>
    </div>
  );
};
