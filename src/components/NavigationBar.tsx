import { Button } from '@/components/ui/button';
import { MessageSquare, Lightbulb, BarChart3, User } from 'lucide-react';
interface NavigationBarProps {
  currentScreen: 'trainer' | 'profile' | 'recommendations' | 'history';
  onScreenChange: (screen: 'trainer' | 'profile' | 'recommendations' | 'history') => void;
}
export const NavigationBar = ({
  currentScreen,
  onScreenChange
}: NavigationBarProps) => {
  return <>
      {/* iOS-style home indicator */}
      <div className="ios-home-indicator" />
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 backdrop-blur-md z-50">
        <div className="flex justify-around items-center pb-6 mx-0 px-[8px] bg-slate-950 py-px">
          <Button variant="ghost" size="sm" className={`flex flex-col items-center gap-1 px-3 py-2 h-auto min-h-[60px] transition-all duration-200 ${currentScreen === 'trainer' ? 'text-primary drop-shadow-[0_0_20px_hsl(var(--primary))]' : 'text-muted-foreground hover:text-foreground'}`} onClick={() => onScreenChange('trainer')}>
            <MessageSquare className="w-7 h-7 stroke-[2.5px]" />
            <span className="text-xs font-bold">Практика</span>
          </Button>
          
          <Button variant="ghost" size="sm" className={`flex flex-col items-center gap-1 px-3 py-2 h-auto min-h-[60px] transition-all duration-200 ${currentScreen === 'recommendations' ? 'text-primary drop-shadow-[0_0_20px_hsl(var(--primary))]' : 'text-muted-foreground hover:text-foreground'}`} onClick={() => onScreenChange('recommendations')}>
            <Lightbulb className="w-7 h-7 stroke-[2.5px]" />
            <span className="text-xs font-bold">Советы</span>
          </Button>

          <Button variant="ghost" size="sm" className={`flex flex-col items-center gap-1 px-3 py-2 h-auto min-h-[60px] transition-all duration-200 ${currentScreen === 'history' ? 'text-primary drop-shadow-[0_0_20px_hsl(var(--primary))]' : 'text-muted-foreground hover:text-foreground'}`} onClick={() => onScreenChange('history')}>
            <BarChart3 className="w-7 h-7 stroke-[2.5px]" />
            <span className="text-xs font-bold">Прогресс</span>
          </Button>
          
          <Button variant="ghost" size="sm" className={`flex flex-col items-center gap-1 px-3 py-2 h-auto min-h-[60px] transition-all duration-200 ${currentScreen === 'profile' ? 'text-primary drop-shadow-[0_0_20px_hsl(var(--primary))]' : 'text-muted-foreground hover:text-foreground'}`} onClick={() => onScreenChange('profile')}>
            <User className="w-7 h-7 stroke-[2.5px]" />
            <span className="text-xs font-bold">Аккаунт</span>
          </Button>
        </div>
      </div>
    </>;
};