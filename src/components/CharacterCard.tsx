import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, User } from 'lucide-react';

interface CharacterProps {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  avatar: string;
  personality: string;
  isLocked?: boolean;
  onSelect: () => void;
}

const levelConfig = {
  beginner: {
    label: 'Новичок',
    color: 'bg-green-500',
    description: 'Простые диалоги и знакомства'
  },
  intermediate: {
    label: 'Средний',
    color: 'bg-yellow-500',
    description: 'Более сложные темы и флирт'
  },
  advanced: {
    label: 'Продвинутый',
    color: 'bg-red-500',
    description: 'Сложные ситуации и романтические беседы'
  }
};

export const CharacterCard = ({
  name,
  level,
  description,
  avatar,
  personality,
  isLocked = false,
  onSelect
}: CharacterProps) => {
  const config = levelConfig[level];
  
  return (
    <Card className="p-4 bg-gradient-card border border-border/50 hover:border-primary/50 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-2xl">
            <User className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{name}</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${config.color}`}></div>
              <span className="text-xs text-muted-foreground">{config.label}</span>
            </div>
          </div>
        </div>
        
        {!isLocked && (
          <Button
            size="sm"
            onClick={onSelect}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-10 h-10 p-0"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground mb-2">{description}</p>
      <p className="text-xs text-muted-foreground/80">{config.description}</p>
      
      {isLocked && (
        <div className="mt-3 text-center">
          <span className="text-xs text-primary">🔒 Премиум</span>
        </div>
      )}
    </Card>
  );
};