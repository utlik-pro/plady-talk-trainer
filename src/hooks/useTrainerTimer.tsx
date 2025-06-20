
import { useState, useEffect } from 'react';

interface UseTrainerTimerProps {
  userRole: 'free' | 'premium';
  onPaywallReached: () => void;
  onTimeIncrement: (seconds: number) => void;
}

export const useTrainerTimer = ({ userRole, onPaywallReached, onTimeIncrement }: UseTrainerTimerProps) => {
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => {
        const newTime = prev + 1;
        onTimeIncrement(1);
        
        // Check if free user reached 3 minutes (180 seconds)
        if (userRole === 'free' && newTime >= 180) {
          onPaywallReached();
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [userRole, onTimeIncrement, onPaywallReached]);

  const resetTimer = () => {
    setTimeSpent(0);
  };

  return {
    timeSpent,
    resetTimer
  };
};
