
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
    name: 'София',
    level: 'beginner' as const,
    description: 'Дружелюбная студентка, любит простое общение',
    avatar: '👩‍🎓',
    personality: 'Открытая и приветливая девушка, которая любит узнавать новых людей'
  },
  {
    name: 'Анна',
    level: 'intermediate' as const,
    description: 'Творческая личность с чувством юмора',
    avatar: '👩‍🎨',
    personality: 'Умная и остроумная, любит глубокие разговоры'
  },
  {
    name: 'Виктория',
    level: 'advanced' as const,
    description: 'Уверенная в себе бизнес-леди',
    avatar: '👩‍💼',
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
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-foreground">Talk to a Tutor</h1>
          <div className="w-6 h-6 rounded-md bg-muted-foreground/20 flex items-center justify-center">
            <div className="w-3 h-3 rounded-sm bg-muted-foreground/40"></div>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          Практикуйте навыки общения с разными персонажами
        </p>
      </div>

      {/* Characters Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        {characters.map((char, index) => (
          <Card key={index} className="p-6 bg-gradient-card border-border/50 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
                  <User className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {char.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {char.description}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full px-6"
                onClick={() => {
                  if (char.isLocked && userRole === 'free') return;
                  onStartListening();
                }}
                disabled={char.isLocked && userRole === 'free'}
              >
                {char.isLocked && userRole === 'free' ? 'Заблокировано' : 'Начать'}
              </Button>
            </div>
            {char.isLocked && userRole === 'free' && (
              <div className="absolute inset-0 bg-background/50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full bg-muted-foreground/20 flex items-center justify-center mx-auto mb-2">
                    <div className="w-4 h-4 rounded-sm bg-muted-foreground/40"></div>
                  </div>
                  <p className="text-xs text-muted-foreground">Premium</p>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
