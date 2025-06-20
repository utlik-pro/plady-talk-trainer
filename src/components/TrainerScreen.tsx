
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import { useVoiceChat } from '@/hooks/useVoiceChat';
import { useTrainerTimer } from '@/hooks/useTrainerTimer';
import { useConversationMessages } from '@/hooks/useConversationMessages';
import { useConversationHistory } from '@/hooks/useConversationHistory';
import { toast } from '@/hooks/use-toast';
import { TrainerHeader } from './TrainerHeader';
import { TrainerContent } from './TrainerContent';
import { ConversationAnalysis } from './ConversationAnalysis';
import type { Character } from '@/types/conversation';

interface TrainerScreenProps {
  onPaywallReached: () => void;
  onProfileClick: () => void;
}

const character: Character = {
  name: "Анна",
  avatar: "👩‍🦰",
  personality: "Дружелюбная и общительная девушка, любит интересные разговоры"
};

export const TrainerScreen = ({ onPaywallReached, onProfileClick }: TrainerScreenProps) => {
  const { user, profile } = useAuth();
  const { incrementTrainingTime } = useProgress();
  const voiceChat = useVoiceChat();
  const [showAnalysis, setShowAnalysis] = useState(false);
  const { createSession, endSession } = useConversationHistory();

  const { timeSpent, resetTimer } = useTrainerTimer({
    userRole: profile?.role || 'free',
    onPaywallReached,
    onTimeIncrement: incrementTrainingTime
  });

  const { conversationMessages, currentSessionId, startNewSession, resetMessages } = useConversationMessages();

  const handleStartConversation = async () => {
    if (!user) return;
    
    // Create new session in database
    const sessionId = await createSession(character);
    if (sessionId) {
      startNewSession(sessionId);
      voiceChat.startListening();
    } else {
      toast({
        title: "Ошибка",
        description: "Не удалось начать разговор",
        variant: "destructive"
      });
    }
  };

  const handleEndConversation = async () => {
    voiceChat.stopListening();
    
    if (conversationMessages.length > 0 && currentSessionId) {
      // End session in database
      await endSession(currentSessionId, timeSpent);
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

  // Override voice chat start listening to use our session management
  const originalStartListening = voiceChat.startListening;
  useEffect(() => {
    voiceChat.startListening = handleStartConversation;
  }, []);

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
        userRole={profile?.role || 'free'}
        onEndConversation={handleEndConversation}
        onProfileClick={onProfileClick}
      />
      
      <TrainerContent
        character={character}
        isListening={voiceChat.isListening}
        isSpeaking={voiceChat.isSpeaking}
        conversationMessagesCount={conversationMessages.length}
        timeSpent={timeSpent}
        userRole={profile?.role || 'free'}
        onStartListening={handleStartConversation}
        onStopListening={voiceChat.stopListening}
      />
    </div>
  );
};
