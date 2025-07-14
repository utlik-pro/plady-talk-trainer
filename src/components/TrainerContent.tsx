
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
      {/* First Step Card */}
      <Card className="p-6 mb-6 bg-gradient-primary text-primary-foreground relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Первый шаг</h2>
              <p className="text-primary-foreground/90 text-sm">
                Выберите собеседницу для практики навыков общения
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <ArrowRight className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-primary-foreground/10"></div>
      </Card>

      {/* Characters section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Выберите собеседницу
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Каждая девушка имеет свой характер и уровень сложности
          </p>
        </div>

        <div className="space-y-4">
          {characters.map((char, index) => (
            <CharacterCard
              key={index}
              {...char}
              isLocked={char.isLocked && userRole === 'free'}
              onSelect={() => {
                if (char.isLocked && userRole === 'free') return;
                onStartListening();
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
