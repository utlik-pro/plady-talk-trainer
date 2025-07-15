
import { VoiceInterface } from './VoiceInterface';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CharacterCard } from './CharacterCard';
import { ArrowRight, User } from 'lucide-react';

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

const characters = [
  {
    name: 'Анна',
    level: 'beginner' as const,
    description: 'Дружелюбная студентка, любит простое общение',
    avatar: '/lovable-uploads/4967c98a-1550-4b6b-98a3-149ef4c36303.png',
    personality: 'Открытая и приветливая девушка, которая любит узнавать новых людей'
  },
  {
    name: 'Анастасия',
    level: 'intermediate' as const,
    description: 'Творческая личность с чувством юмора',
    avatar: '/lovable-uploads/4967c98a-1550-4b6b-98a3-149ef4c36303.png',
    personality: 'Умная и остроумная, любит глубокие разговоры'
  },
  {
    name: 'Инна',
    level: 'advanced' as const,
    description: 'Уверенная в себе бизнес-леди',
    avatar: '/lovable-uploads/4967c98a-1550-4b6b-98a3-149ef4c36303.png',
    personality: 'Амбициозная и харизматичная, ценит интеллект',
    isLocked: true
  }
];

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

  if (isListening || conversationMessagesCount > 0) {
    // Active conversation state
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-32">
        <div className="text-center space-y-6 max-w-sm mx-auto">
          {/* Character avatar */}
          <div className="w-32 h-32 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-6 relative">
            <User className="w-16 h-16 text-primary-foreground" />
            {isListening && (
              <div className="absolute inset-0 rounded-full border-4 border-primary animate-pulse"></div>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Разговор с {character.name}
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              {isListening ? 'Слушаю вас...' : 'Готов к разговору'}
            </p>
          </div>

          {/* Timer */}
          {(isListening || timeSpent > 0) && (
            <Card className="p-4 bg-gradient-accent border-border/50">
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-foreground mb-1">
                  {formatTime(timeSpent)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {isListening ? 'Время разговора' : 'Продолжительность'}
                </div>
                {userRole === 'free' && timeSpent > 0 && timeSpent < 180 && isListening && (
                  <div className="text-xs text-primary mt-1">
                    Осталось: {formatTime(180 - timeSpent)}
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Voice Interface */}
          <VoiceInterface
            isListening={isListening}
            isSpeaking={isSpeaking}
            onStartListening={onStartListening}
            onStopListening={onStopListening}
          />

          {/* End conversation button */}
          {isListening && conversationMessagesCount > 0 && (
            <Button
              variant="destructive"
              onClick={onEndConversation}
              className="w-full"
            >
              Завершить разговор
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Character selection state
  return (
    <div className="flex-1 p-6 pb-32">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Talk to a Tutor</h1>
        <p className="text-muted-foreground text-sm">
          Выберите девушку для практики навыков общения
        </p>
      </div>

      {/* Characters Horizontal Scroll */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {characters.map((char, index) => (
            <div key={index} className="relative">
              <Card className="w-64 h-80 bg-gradient-card border-border/50 overflow-hidden relative">
                {/* Character Image */}
                <div className="relative h-48 bg-gradient-primary flex items-center justify-center">
                  <img 
                    src={char.avatar} 
                    alt={char.name}
                    className="w-full h-full object-cover"
                  />
                  {char.isLocked && userRole === 'free' && (
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-sm bg-muted-foreground/40"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Character Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-1">
                      {char.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {char.description}
                    </p>
                  </div>

                  {/* Talk Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full rounded-full py-3 font-medium transition-all duration-200 ${
                      char.isLocked && userRole === 'free' 
                        ? 'bg-muted/30 text-muted-foreground cursor-not-allowed' 
                        : 'bg-muted/50 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20 text-foreground'
                    }`}
                    onClick={() => {
                      if (char.isLocked && userRole === 'free') return;
                      onStartListening();
                    }}
                    disabled={char.isLocked && userRole === 'free'}
                  >
                    {char.isLocked && userRole === 'free' ? 'Заблокировано' : 'Поговорить'}
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
