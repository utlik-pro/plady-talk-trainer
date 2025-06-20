
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useConversationHistory } from '@/hooks/useConversationHistory';
import { toast } from '@/hooks/use-toast';

interface PaywallScreenProps {
  onBack: () => void;
  onSubscribe: () => void;
}

export const PaywallScreen = ({ onBack, onSubscribe }: PaywallScreenProps) => {
  const { user, profile } = useAuth();
  const { sessions } = useConversationHistory();

  const handleSubscribe = () => {
    // Переход в Telegram канал для оплаты подписки
    window.open('https://t.me/dmitryutlik', '_blank');
    
    // Показываем уведомление
    toast({
      title: "Переход к оплате",
      description: "Открывается Telegram для оформления подписки"
    });
  };

  const isSessionLimitReached = profile?.role === 'free' && sessions.length >= 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-plady-pink via-plady-purple to-plady-dark flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl animate-fade-in">
        {/* Icon */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{isSessionLimitReached ? '🔒' : '⏰'}</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {isSessionLimitReached 
              ? 'Лимит сессий исчерпан' 
              : 'Время бесплатного доступа истекло'
            }
          </h1>
          <p className="text-gray-600">
            {isSessionLimitReached 
              ? `Вы использовали ${sessions.length} из 3 доступных сессий`
              : 'Продолжи обучение с подпиской Plady Premium'
            }
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">✓</span>
            </div>
            <span className="text-gray-700">Безлимитное количество сессий</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">✓</span>
            </div>
            <span className="text-gray-700">Безлимитное время тренировок</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">✓</span>
            </div>
            <span className="text-gray-700">Доступ ко всем персонажам</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">✓</span>
            </div>
            <span className="text-gray-700">ИИ-рекомендации и анализ</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">✓</span>
            </div>
            <span className="text-gray-700">Продвинутые сценарии</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-gradient-to-r from-plady-pink to-plady-purple p-6 rounded-2xl text-white mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">₽599</div>
            <div className="text-sm opacity-90">в месяц</div>
            <div className="text-xs opacity-75 mt-2">Отмена в любое время</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleSubscribe}
            className="w-full bg-gradient-to-r from-plady-pink to-plady-purple text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Оформить подписку
          </Button>
          
          <Button
            onClick={onBack}
            variant="ghost"
            className="w-full text-gray-600 hover:text-gray-800"
          >
            Вернуться назад
          </Button>
        </div>

        {/* Guarantee */}
        <div className="text-center mt-6 p-3 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-600">
            🛡️ 7-дневная гарантия возврата средств
          </p>
        </div>
      </div>
    </div>
  );
};
