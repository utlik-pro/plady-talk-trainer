
import { VoiceInterface } from './VoiceInterface';
import { Button } from '@/components/ui/button';

interface TrainerContentProps {
  character: {
    name: string;
    avatar: string;
    personality: string;
  };
  isListening: boolean;
  isSpeaking: boolean;
  conversationMessagesCount: number;
  timeSpent: number;
  userRole: 'free' | 'premium';
  onStartListening: () => void;
  onStopListening: () => void;
  onEndConversation: () => void;
}

export const TrainerContent = ({
  character,
  isListening,
  isSpeaking,
  conversationMessagesCount,
  timeSpent,
  userRole,
  onStartListening,
  onStopListening,
  onEndConversation
}: TrainerContentProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">{character.avatar}</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{character.name}</h2>
        <p className="text-gray-600 mb-6">{character.personality}</p>
        <p className="text-sm text-gray-500 mb-6">
          🎤 Общайтесь с {character.name} естественно, как в реальной жизни
        </p>
        <VoiceInterface
          isListening={isListening}
          isSpeaking={isSpeaking}
          onStartListening={onStartListening}
          onStopListening={onStopListening}
        />
        
        {/* Timer display - показываем только во время разговора или если есть время */}
        {(isListening || timeSpent > 0) && (
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-500 mb-1">
              {isListening ? 'Время разговора' : 'Последний разговор'}
            </div>
            <div className="font-mono font-semibold text-plady-purple text-lg">
              {formatTime(timeSpent)}
            </div>
            {userRole === 'free' && timeSpent > 0 && timeSpent < 180 && isListening && (
              <div className="text-xs text-plady-pink mt-1">
                Осталось: {formatTime(180 - timeSpent)}
              </div>
            )}
          </div>
        )}

        {/* End conversation button under timer */}
        {isListening && conversationMessagesCount > 0 && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onEndConversation}
              className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
            >
              Завершить и получить анализ
            </Button>
          </div>
        )}

        {conversationMessagesCount > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Сообщений в разговоре: {conversationMessagesCount}
          </div>
        )}
      </div>
    </div>
  );
};
