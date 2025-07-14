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
  return <div className="relative">
      {/* Status bar */}
      

      {/* User greeting */}
      <div className="px-6 pb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2 my-0 py-0 mx-0 px-0">
          Привет, Дмитрий!
        </h1>
      </div>
    </div>;
};