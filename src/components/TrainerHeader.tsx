
import { Button } from '@/components/ui/button';

interface TrainerHeaderProps {
  character: {
    name: string;
    avatar: string;
    personality: string;
  };
  timeSpent: number;
  isListening: boolean;
  userRole: 'free' | 'premium';
  onEndConversation: () => void;
}

export const TrainerHeader = ({ 
  character, 
  timeSpent, 
  isListening, 
  userRole, 
  onEndConversation 
}: TrainerHeaderProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-100 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{character.avatar}</div>
          <div>
            <h2 className="font-semibold text-gray-800">{character.name}</h2>
            <p className="text-sm text-gray-500">Голосовой тренинг</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {isListening && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEndConversation}
              className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
            >
              Завершить и получить анализ
            </Button>
          )}
          <div className="text-right">
            <div className="text-sm text-gray-500">Время разговора</div>
            <div className="font-mono font-semibold text-plady-purple">
              {formatTime(timeSpent)}
            </div>
            {userRole === 'free' && (
              <div className="text-xs text-plady-pink">
                Осталось: {formatTime(180 - timeSpent)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
