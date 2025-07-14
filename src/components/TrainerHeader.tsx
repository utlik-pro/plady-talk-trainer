
import { Button } from '@/components/ui/button';
import { User, Settings } from 'lucide-react';

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
  // Status bar simulation
  const currentTime = new Date().toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit'
  });

  return (
    <div className="relative">
      {/* Status bar */}
      <div className="flex justify-between items-center px-6 pt-12 pb-4 text-sm text-foreground">
        <div className="font-semibold">{currentTime}</div>
        <div className="flex items-center space-x-1 text-xs">
          <div className="flex space-x-1">
            <div className="w-1 h-3 bg-foreground rounded-sm opacity-30"></div>
            <div className="w-1 h-3 bg-foreground rounded-sm opacity-60"></div>
            <div className="w-1 h-3 bg-foreground rounded-sm"></div>
            <div className="w-1 h-3 bg-foreground rounded-sm"></div>
          </div>
          <div className="ml-2">📶</div>
          <div className="ml-1">🔋</div>
        </div>
      </div>

      {/* User greeting */}
      <div className="px-6 pb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Привет, Дмитрий!
        </h1>
      </div>
    </div>
  );
};
