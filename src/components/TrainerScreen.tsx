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
  const { createSession, endSession, canCreateNewSession, sessions } = useConversationHistory();

  // Таймер теперь активен только когда идет разговор
  const { timeSpent, resetTimer } = useTrainerTimer({
    userRole: profile?.role || 'free',
    onPaywallReached,
    onTimeIncrement: incrementTrainingTime,
    isActive: voiceChat.isListening // Таймер активен только при прослушивании
  });

  const { 
    conversationMessages, 
    currentSessionId, 
    elevenLabsConversationId,
    startNewSession, 
    updateMessages,
    resetMessages 
  } = useConversationMessages();

  // Синхронизируем сообщения с ElevenLabs и сохраняем в базу данных
  useEffect(() => {
    if (voiceChat.messages.length > 0) {
      console.log('ElevenLabs messages updated:', voiceChat.messages.length);
      updateMessages(voiceChat.messages);
    }
  }, [voiceChat.messages, updateMessages]);

  const handleStartConversation = async () => {
    if (!user) return;
    
    // Проверяем лимит сессий для бесплатного тарифа
    if (!canCreateNewSession()) {
      console.log('Session limit reached for free user:', sessions.length);
      toast({
        title: "Лимит исчерпан",
        description: "Доступно только 3 сессии в бесплатном тарифе",
        variant: "destructive"
      });
      onPaywallReached();
      return;
    }
    
    try {
      console.log('Starting new conversation...');
      
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

      console.log('Database session created:', sessionId);

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

      console.log('ElevenLabs conversation started:', elevenLabsConversationId);

      // Связываем сессии
      startNewSession(sessionId, elevenLabsConversationId);
      
      // Сбрасываем таймер при начале нового разговора
      resetTimer();
      
      toast({
        title: "Разговор начат",
        description: `Сессия: ${sessionId.substring(0, 8)}...`,
      });

    } catch (error) {
      console.error('Error starting conversation:', error);
      
      if (error instanceof Error && error.message === 'SESSION_LIMIT_REACHED') {
        toast({
          title: "Лимит исчерпан",
          description: "Доступно только 3 сессии в бесплатном тарифе",
          variant: "destructive"
        });
        onPaywallReached();
        return;
      }
      
      toast({
        title: "Ошибка",
        description: "Не удалось начать разговор",
        variant: "destructive"
      });
    }
  };

  const handleEndConversation = async () => {
    try {
      console.log('Ending conversation with', conversationMessages.length, 'messages');
      
      // Останавливаем голосовой чат
      await voiceChat.stopListening();
      
      if (conversationMessages.length > 0 && currentSessionId) {
        // Завершаем сессию в базе данных
        await endSession(currentSessionId, timeSpent);
        
        console.log('Session ended successfully:', {
          sessionId: currentSessionId,
          messagesCount: conversationMessages.length,
          duration: timeSpent
        });

        setShowAnalysis(true);
      } else {
        console.log('No messages to save or no session ID');
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
    <div className="min-h-screen bg-background">
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
        onEndConversation={handleEndConversation}
      />
    </div>
  );
};
