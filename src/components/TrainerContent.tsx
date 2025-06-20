
import { VoiceInterface } from './VoiceInterface';

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
}

export const TrainerContent = ({
  character,
  isListening,
  isSpeaking,
  conversationMessagesCount,
  timeSpent,
  userRole,
  onStartListening,
  onStopListening
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
        
        {/* Timer display under the button */}
        <div className="mt-4 text-center">
          <div className="text-sm text-gray-500 mb-1">Время разговора</div>
          <div className="font-mono font-semibold text-plady-purple text-lg">
            {formatTime(timeSpent)}
          </div>
          {userRole === 'free' && timeSpent > 0 && (
            <div className="text-xs text-plady-pink mt-1">
              Осталось: {formatTime(180 - timeSpent)}
            </div>
          )}
        </div>

        {conversationMessagesCount > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Сообщений в разговоре: {conversationMessagesCount}
          </div>
        )}
      </div>
    </div>
  );
};
