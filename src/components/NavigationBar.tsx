
import { Button } from '@/components/ui/button';

interface NavigationBarProps {
  currentScreen: 'trainer' | 'profile';
  onScreenChange: (screen: 'trainer' | 'profile') => void;
}

export const NavigationBar = ({ currentScreen, onScreenChange }: NavigationBarProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
      <div className="flex justify-around max-w-md mx-auto">
        <Button
          variant={currentScreen === 'trainer' ? 'default' : 'ghost'}
          className={`flex-1 mx-1 ${
            currentScreen === 'trainer' 
              ? 'bg-gradient-to-r from-plady-pink to-plady-purple text-white' 
              : 'text-gray-600'
          }`}
          onClick={() => onScreenChange('trainer')}
        >
          <div className="text-center">
            <div className="text-lg mb-1">🎭</div>
            <div className="text-xs">Тренажёр</div>
          </div>
        </Button>
        
        <Button
          variant={currentScreen === 'profile' ? 'default' : 'ghost'}
          className={`flex-1 mx-1 ${
            currentScreen === 'profile' 
              ? 'bg-gradient-to-r from-plady-pink to-plady-purple text-white' 
              : 'text-gray-600'
          }`}
          onClick={() => onScreenChange('profile')}
        >
          <div className="text-center">
            <div className="text-lg mb-1">👤</div>
            <div className="text-xs">Профиль</div>
          </div>
        </Button>
      </div>
    </div>
  );
};
