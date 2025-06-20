
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import { useVoiceChat } from '@/hooks/useVoiceChat';
import { toast } from '@/hooks/use-toast';
import { VoiceSetupModal } from './VoiceSetupModal';
import { VoiceInterface } from './VoiceInterface';

interface TrainerScreenProps {
  onPaywallReached: () => void;
}

interface Character {
  name: string;
  avatar: string;
  personality: string;
}

interface Reply {
  id: string;
  text: string;
  type: 'good' | 'neutral' | 'bad';
}

const character: Character = {
  name: "Анна",
  avatar: "👩‍🦰",
  personality: "Дружелюбная и общительная девушка, любит интересные разговоры"
};

const scenarios = [
  {
    situation: "Ты познакомился с Анной в кафе. Она сидит за столиком одна и читает книгу.",
    characterMessage: "О, привет! Я заметила, что ты на меня смотришь. Хочешь присесть?",
    replies: [
      { id: '1', text: "Да, конечно! Что читаешь?", type: 'good' as const },
      { id: '2', text: "Эм... я просто проходил мимо", type: 'bad' as const },
      { id: '3', text: "Привет! Можно узнать твоё имя?", type: 'neutral' as const },
      { id: '4', text: "Ты очень красивая", type: 'bad' as const }
    ]
  },
  {
    situation: "Анна согласилась на свидание. Вы встречаетесь в парке.",
    characterMessage: "Как дела? Я рада, что мы встретились! Куда пойдём?",
    replies: [
      { id: '1', text: "Давай прогуляемся и поговорим", type: 'good' as const },
      { id: '2', text: "Не знаю, решай сама", type: 'bad' as const },
      { id: '3', text: "Может, в кино?", type: 'neutral' as const },
      { id: '4', text: "Я знаю отличное место!", type: 'good' as const }
    ]
  }
];

export const TrainerScreen = ({ onPaywallReached }: TrainerScreenProps) => {
  const { user } = useAuth();
  const { incrementTrainingTime } = useProgress();
  const voiceChat = useVoiceChat();
  
  const [currentScenario, setCurrentScenario] = useState(0);
  const [chatHistory, setChatHistory] = useState<Array<{text: string, sender: 'user' | 'character'}>>([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [showVoiceSetup, setShowVoiceSetup] = useState(false);

  useEffect(() => {
    // Initialize first message only in text mode
    if (chatHistory.length === 0 && !isVoiceMode) {
      setChatHistory([{
        text: scenarios[currentScenario].characterMessage,
        sender: 'character'
      }]);
    }
  }, [currentScenario, chatHistory.length, isVoiceMode]);

  useEffect(() => {
    // Timer for tracking training time
    const timer = setInterval(() => {
      setTimeSpent(prev => {
        const newTime = prev + 1;
        incrementTrainingTime(1);
        
        // Check if free user reached 3 minutes (180 seconds)
        if (user?.role === 'free' && newTime >= 180) {
          onPaywallReached();
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [user, incrementTrainingTime, onPaywallReached]);

  const handleReplySelect = (reply: Reply) => {
    // Add user message
    const userMessage = { text: reply.text, sender: 'user' as const };
    setChatHistory(prev => [...prev, userMessage]);

    // Add character response based on reply type
    setTimeout(() => {
      let characterResponse = '';
      switch (reply.type) {
        case 'good':
          characterResponse = "Мне нравится твой подход! Ты умеешь поддержать разговор.";
          break;
        case 'neutral':
          characterResponse = "Неплохо, но можно было бы проявить больше инициативы.";
          break;
        case 'bad':
          characterResponse = "Хм... этот ответ меня не очень впечатлил.";
          break;
      }

      setChatHistory(prev => [...prev, { text: characterResponse, sender: 'character' }]);

      // Show feedback
      toast({
        title: reply.type === 'good' ? "Отличный выбор!" : reply.type === 'neutral' ? "Можно лучше" : "Попробуй другой подход",
        description: reply.type === 'good' ? "Такой ответ располагает к общению" : 
                    reply.type === 'neutral' ? "Этот ответ нейтральный, но безопасный" : 
                    "Такой ответ может оттолкнуть",
        variant: reply.type === 'bad' ? "destructive" : "default"
      });
    }, 1000);
  };

  const handleVoiceSetup = (apiKey: string) => {
    voiceChat.configure({ 
      apiKey, 
      agentId: 'agent_01jy3m8mhpe3092q9cmsvzcwe8' 
    });
    toast({
      title: "Голосовой чат настроен!",
      description: "Теперь вы можете общаться голосом с Анной"
    });
  };

  const toggleVoiceMode = () => {
    if (!voiceChat.isConfigured) {
      setShowVoiceSetup(true);
      return;
    }
    
    // If currently listening, stop the conversation first
    if (voiceChat.isListening) {
      voiceChat.stopListening();
    }
    
    setIsVoiceMode(!isVoiceMode);
    
    // Clear chat history when switching modes
    setChatHistory([]);
    
    console.log('Switched to', !isVoiceMode ? 'voice' : 'text', 'mode');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const scenario = scenarios[currentScenario];

  return (
    <div className="min-h-screen bg-gradient-to-br from-plady-light to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{character.avatar}</div>
            <div>
              <h2 className="font-semibold text-gray-800">{character.name}</h2>
              <p className="text-sm text-gray-500">Уровень 1</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleVoiceMode}
              className={isVoiceMode ? 'bg-plady-pink text-white' : ''}
            >
              🎤 {isVoiceMode ? 'Голосовой' : 'Текстовый'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowVoiceSetup(true)}
            >
              <Settings className="w-4 h-4" />
            </Button>
            <div className="text-right">
              <div className="text-sm text-gray-500">Время тренировки</div>
              <div className="font-mono font-semibold text-plady-purple">
                {formatTime(timeSpent)}
              </div>
              {user?.role === 'free' && (
                <div className="text-xs text-plady-pink">
                  Осталось: {formatTime(180 - timeSpent)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scenario description - only show in text mode */}
      {!isVoiceMode && (
        <div className="p-4 bg-plady-light border-b border-gray-100">
          <p className="text-sm text-gray-700 italic">
            📍 {scenario.situation}
          </p>
        </div>
      )}

      {/* Voice mode description */}
      {isVoiceMode && (
        <div className="p-4 bg-plady-light border-b border-gray-100">
          <p className="text-sm text-gray-700 italic">
            🎤 Голосовой режим: Общайтесь с Анной естественно, как в реальной жизни
          </p>
        </div>
      )}

      {/* Chat area - only show in text mode */}
      {!isVoiceMode && (
        <div className="flex-1 p-4 space-y-4 max-h-96 overflow-y-auto">
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-plady-pink to-plady-purple text-white'
                    : 'bg-white shadow-sm border border-gray-100 text-gray-800'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Voice Interface */}
      {isVoiceMode && voiceChat.isConfigured && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">{character.avatar}</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{character.name}</h2>
            <p className="text-gray-600 mb-6">{character.personality}</p>
            <VoiceInterface
              isListening={voiceChat.isListening}
              isSpeaking={voiceChat.isSpeaking}
              onStartListening={voiceChat.startListening}
              onStopListening={voiceChat.stopListening}
            />
          </div>
        </div>
      )}

      {/* Reply options - only show in text mode */}
      {!isVoiceMode && (
        <div className="p-4 bg-white border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Выбери ответ:</h3>
          <div className="space-y-2">
            {scenario.replies.map((reply) => (
              <Button
                key={reply.id}
                variant="outline"
                className={`w-full text-left justify-start p-3 h-auto hover:shadow-md transition-all duration-200 ${
                  reply.type === 'good' ? 'border-green-200 hover:border-green-300 hover:bg-green-50' :
                  reply.type === 'bad' ? 'border-red-200 hover:border-red-300 hover:bg-red-50' :
                  'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleReplySelect(reply)}
              >
                <div className="text-wrap text-sm">{reply.text}</div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Voice Setup Modal */}
      <VoiceSetupModal
        isOpen={showVoiceSetup}
        onClose={() => setShowVoiceSetup(false)}
        onSave={handleVoiceSetup}
      />
    </div>
  );
};
