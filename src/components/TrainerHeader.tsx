
import { Button } from '@/components/ui/button';

interface TrainerHeaderProps {
  character: {
    name: string;
    avatar: string;
    personality: string;
  };
  isListening: boolean;
  userRole: 'free' | 'premium';
  onEndConversation: () => void;
}

export const TrainerHeader = ({ 
  character, 
  isListening, 
  userRole, 
  onEndConversation 
}: TrainerHeaderProps) => {
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
        </div>
      </div>
    </div>
  );
};
