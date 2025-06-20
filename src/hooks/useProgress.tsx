
import { createContext, useContext, useState, ReactNode } from 'react';

interface Progress {
  trainingTime: number; // in seconds
  level: number;
  skills: string[];
  history: ChatMessage[];
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'character';
  timestamp: Date;
}

interface ProgressContextType {
  progress: Progress;
  addChatMessage: (message: ChatMessage) => void;
  incrementTrainingTime: (seconds: number) => void;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState<Progress>({
    trainingTime: 0,
    level: 1,
    skills: [],
    history: []
  });

  const addChatMessage = (message: ChatMessage) => {
    setProgress(prev => ({
      ...prev,
      history: [...prev.history, message]
    }));
  };

  const incrementTrainingTime = (seconds: number) => {
    setProgress(prev => ({
      ...prev,
      trainingTime: prev.trainingTime + seconds
    }));
  };

  const resetProgress = () => {
    setProgress({
      trainingTime: 0,
      level: 1,
      skills: [],
      history: []
    });
  };

  return (
    <ProgressContext.Provider value={{
      progress,
      addChatMessage,
      incrementTrainingTime,
      resetProgress
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
