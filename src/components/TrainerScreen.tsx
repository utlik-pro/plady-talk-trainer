
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import { useVoiceChat } from '@/hooks/useVoiceChat';
import { useTrainerTimer } from '@/hooks/useTrainerTimer';
import { useConversationMessages } from '@/hooks/useConversationMessages';
import { toast } from '@/hooks/use-toast';
import { TrainerHeader } from './TrainerHeader';
import { TrainerContent } from './TrainerContent';
import { ConversationAnalysis } from './ConversationAnalysis';

interface TrainerScreenProps {
  onPaywallReached: () => void;
  onProfileClick: () => void;
}

interface Character {
  name: string;
  avatar: string;
  personality: string;
}

const character: Character = {
  name: "Анна",
  avatar: "👩‍🦰",
  personality: "Дружелюбная и общительная девушка, любит интересные разговоры"
};

export const TrainerScreen = ({ onPaywallReached, onProfileClick }: TrainerScreenProps) => {
  const { user } = useAuth();
  const { incrementTrainingTime } = useProgress();
  const voiceChat = useVoiceChat();
  const [showAnalysis, setShowAnalysis] = useState(false);

  const { timeSpent, resetTimer } = useTrainerTimer({
    userRole: user?.role || 'free',
    onPaywallReached,
    onTimeIncrement: incrementTrainingTime
  });

  const { conversationMessages, resetMessages } = useConversationMessages();

  const handleEndConversation = () => {
    voiceChat.stopListening();
    if (conversationMessages.length > 0) {
      setShowAnalysis(true);
    } else {
      toast({
        title: "Разговор слишком короткий",
        description: "Поговорите подольше, чтобы получить анализ",
        variant: "destructive"
      });
    }
  };

  const handleStartNewConversation = () => {
    setShowAnalysis(false);
    resetMessages();
    resetTimer();
  };

  if (showAnalysis) {
    return (
      <ConversationAnalysis
        messages={conversationMessages}
        character={character}
        onStartNew={handleStartNewConversation}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-plady-light to-white">
      <TrainerHeader
        character={character}
        isListening={voiceChat.isListening}
        userRole={user?.role || 'free'}
        onEndConversation={handleEndConversation}
        onProfileClick={onProfileClick}
      />
      
      <TrainerContent
        character={character}
        isListening={voiceChat.isListening}
        isSpeaking={voiceChat.isSpeaking}
        conversationMessagesCount={conversationMessages.length}
        timeSpent={timeSpent}
        userRole={user?.role || 'free'}
        onStartListening={voiceChat.startListening}
        onStopListening={voiceChat.stopListening}
      />
    </div>
  );
};
