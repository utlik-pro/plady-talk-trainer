
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

  const { 
    conversationMessages, 
    currentSessionId, 
    elevenLabsConversationId,
    startNewSession, 
    updateMessages,
    resetMessages 
  } = useConversationMessages();

  // Синхронизируем сообщения с ElevenLabs
  useEffect(() => {
    if (voiceChat.messages.length > 0) {
      updateMessages(voiceChat.messages);
    }
  }, [voiceChat.messages]);

  const handleStartConversation = async () => {
    if (!user) return;
    
    try {
      // Создаем новую сессию в базе данных
      const sessionId = await createSession(character);
      if (!sessionId) {
        toast({
          title: "Ошибка",
          description: "Не удалось создать сессию в базе данных",
          variant: "destructive"
        });
        return;
      }

      // Запускаем разговор с ElevenLabs
      const elevenLabsConversationId = await voiceChat.startListening();
      if (!elevenLabsConversationId) {
        toast({
          title: "Ошибка",
          description: "Не удалось подключиться к ElevenLabs",
          variant: "destructive"
        });
        return;
      }

      // Связываем сессии
      startNewSession(sessionId, elevenLabsConversationId);
      
      console.log('Session started:', {
        databaseSessionId: sessionId,
        elevenLabsConversationId: elevenLabsConversationId
      });

      toast({
        title: "Разговор начат",
        description: `ElevenLabs ID: ${elevenLabsConversationId}`,
      });

    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось начать разговор",
        variant: "destructive"
      });
    }
  };

  const handleEndConversation = async () => {
    try {
      // Останавливаем голосовой чат
      await voiceChat.stopListening();
      
      if (conversationMessages.length > 0 && currentSessionId) {
        // Завершаем сессию в базе данных
        await endSession(currentSessionId, timeSpent);
        
        console.log('Session ended:', {
          databaseSessionId: currentSessionId,
          elevenLabsConversationId: elevenLabsConversationId,
          messagesCount: conversationMessages.length,
          duration: timeSpent
        });

        setShowAnalysis(true);
      } else {
        toast({
          title: "Разговор слишком короткий",
          description: "Поговорите подольше, чтобы получить анализ",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error ending conversation:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось завершить разговор",
        variant: "destructive"
      });
    }
  };

  const handleStartNewConversation = () => {
    setShowAnalysis(false);
    resetMessages();
    resetTimer();
    voiceChat.clearMessages();
  };

  if (showAnalysis) {
    return (
      <ConversationAnalysis
        messages={conversationMessages}
        character={character}
        sessionId={currentSessionId}
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
        onStopListening={handleEndConversation}
      />

      {/* Debug info */}
      {currentSessionId && (
        <div className="fixed bottom-20 left-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs">
          <div>DB Session: {currentSessionId}</div>
          {elevenLabsConversationId && (
            <div>ElevenLabs: {elevenLabsConversationId}</div>
          )}
          <div>Messages: {conversationMessages.length}</div>
        </div>
      )}
    </div>
  );
};
