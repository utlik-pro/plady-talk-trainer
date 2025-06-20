
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

interface TrainerHeaderProps {
  character: {
    name: string;
    avatar: string;
    personality: string;
  };
  isListening: boolean;
  userRole: 'free' | 'premium';
  onEndConversation: () => void;
  onProfileClick: () => void;
}

export const TrainerHeader = ({ 
  character, 
  isListening, 
  userRole, 
  onEndConversation,
  onProfileClick
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
          <Button
            variant="ghost"
            size="sm"
            onClick={onProfileClick}
            className="text-gray-600 hover:text-gray-800"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
