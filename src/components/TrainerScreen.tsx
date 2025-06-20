
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import { useVoiceChat } from '@/hooks/useVoiceChat';
import { toast } from '@/hooks/use-toast';
import { VoiceInterface } from './VoiceInterface';
import { ConversationAnalysis } from './ConversationAnalysis';

interface TrainerScreenProps {
  onPaywallReached: () => void;
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

export const TrainerScreen = ({ onPaywallReached }: TrainerScreenProps) => {
  const { user } = useAuth();
  const { incrementTrainingTime } = useProgress();
  const voiceChat = useVoiceChat();
  
  const [timeSpent, setTimeSpent] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [conversationMessages, setConversationMessages] = useState<Array<{text: string, sender: 'user' | 'character'}>>([]);

  useEffect(() => {
    // Timer for tracking training time
    const timer = setInterval(() => {
      setTimeSpent(prev => {
        const newTime = prev + 1;
        incrementTrainingTime(1);
        
        // Check if free user reached 3 minutes (180 seconds)
        if (user?.role === 'free' && newTime >= 180) {
          onPaywallReached();
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [user, incrementTrainingTime, onPaywallReached]);

  // Listen for voice messages and collect them
  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.type === 'user_transcript' && message.final) {
        setConversationMessages(prev => [...prev, { text: message.text, sender: 'user' }]);
      } else if (message.type === 'agent_response') {
        setConversationMessages(prev => [...prev, { text: message.text, sender: 'character' }]);
      }
    };

    // This would need to be properly integrated with the ElevenLabs conversation
    // For now, we'll simulate collecting messages
    
    return () => {
      // Cleanup
    };
  }, []);

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
    setConversationMessages([]);
    setTimeSpent(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
      {/* Header */}
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
            {voiceChat.isListening && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEndConversation}
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
              {user?.role === 'free' && (
                <div className="text-xs text-plady-pink">
                  Осталось: {formatTime(180 - timeSpent)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Voice Interface */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">{character.avatar}</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">{character.name}</h2>
          <p className="text-gray-600 mb-6">{character.personality}</p>
          <p className="text-sm text-gray-500 mb-6">
            🎤 Общайтесь с Анной естественно, как в реальной жизни
          </p>
          <VoiceInterface
            isListening={voiceChat.isListening}
            isSpeaking={voiceChat.isSpeaking}
            onStartListening={voiceChat.startListening}
            onStopListening={voiceChat.stopListening}
          />
          {conversationMessages.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Сообщений в разговоре: {conversationMessages.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
