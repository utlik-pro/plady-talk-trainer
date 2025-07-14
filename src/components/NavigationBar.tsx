
import { Button } from '@/components/ui/button';
import { MessageSquare, Lightbulb, BarChart3, User } from 'lucide-react';

interface NavigationBarProps {
  currentScreen: 'trainer' | 'profile' | 'recommendations' | 'history';
  onScreenChange: (screen: 'trainer' | 'profile' | 'recommendations' | 'history') => void;
}

export const NavigationBar = ({ currentScreen, onScreenChange }: NavigationBarProps) => {
  return (
    <>
      {/* iOS-style home indicator */}
      <div className="ios-home-indicator" />
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border backdrop-blur-md bg-opacity-95 z-50">
        <div className="flex justify-around items-center px-2 py-2 pb-6">
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 px-3 py-2 h-auto min-h-[60px] rounded-xl transition-all duration-200 ${
              currentScreen === 'trainer' 
                ? 'bg-primary text-primary-foreground shadow-lg' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
            onClick={() => onScreenChange('trainer')}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs font-medium">Практика</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 px-3 py-2 h-auto min-h-[60px] rounded-xl transition-all duration-200 ${
              currentScreen === 'recommendations' 
                ? 'bg-primary text-primary-foreground shadow-lg' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
            onClick={() => onScreenChange('recommendations')}
          >
            <Lightbulb className="w-5 h-5" />
            <span className="text-xs font-medium">Советы</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 px-3 py-2 h-auto min-h-[60px] rounded-xl transition-all duration-200 ${
              currentScreen === 'history' 
                ? 'bg-primary text-primary-foreground shadow-lg' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
            onClick={() => onScreenChange('history')}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs font-medium">Прогресс</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 px-3 py-2 h-auto min-h-[60px] rounded-xl transition-all duration-200 ${
              currentScreen === 'profile' 
                ? 'bg-primary text-primary-foreground shadow-lg' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
            onClick={() => onScreenChange('profile')}
          >
            <User className="w-5 h-5" />
            <span className="text-xs font-medium">Аккаунт</span>
          </Button>
        </div>
      </div>
    </>
  );
};
