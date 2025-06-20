
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
  onStartListening: () => void;
  onStopListening: () => void;
}

export const TrainerContent = ({
  character,
  isListening,
  isSpeaking,
  conversationMessagesCount,
  onStartListening,
  onStopListening
}: TrainerContentProps) => {
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
        {conversationMessagesCount > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Сообщений в разговоре: {conversationMessagesCount}
          </div>
        )}
      </div>
    </div>
  );
};
