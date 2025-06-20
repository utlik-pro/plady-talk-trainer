
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Volume2, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { elevenlabsService } from '@/services/elevenlabsService';
import { useAuth } from '@/hooks/useAuth';
import type { ConversationMessage, Character } from '@/types/conversation';

interface FullAudioPlayerProps {
  messages: ConversationMessage[];
  character: Character;
  onClose: () => void;
}

export const FullAudioPlayer = ({ messages, character, onClose }: FullAudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { user } = useAuth();

  // Сортируем сообщения по времени для правильной последовательности
  const sortedMessages = [...messages].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const playFullConversation = async () => {
    if (sortedMessages.length === 0) {
      toast({
        title: "Нет сообщений",
        description: "В этом разговоре нет сообщений для воспроизведения",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setIsPlaying(true);
    setCurrentMessageIndex(0);

    try {
      await playMessageSequentially(0);
    } catch (error) {
      console.error('Error playing full conversation:', error);
      toast({
        title: "Ошибка воспроизведения",
        description: "Не удалось воспроизвести аудио",
        variant: "destructive"
      });
      setIsPlaying(false);
      setCurrentMessageIndex(-1);
    } finally {
      setIsLoading(false);
    }
  };

  const playMessageSequentially = async (messageIndex: number) => {
    if (messageIndex >= sortedMessages.length) {
      // Все сообщения воспроизведены
      setIsPlaying(false);
      setCurrentMessageIndex(-1);
      toast({
        title: "Воспроизведение завершено",
        description: "Весь разговор был воспроизведен"
      });
      return;
    }

    const message = sortedMessages[messageIndex];
    setCurrentMessageIndex(messageIndex);

    try {
      // Определяем голос в зависимости от отправителя
      const voice = message.sender === 'user' ? 'alloy' : 'nova';
      
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          voice: voice,
          input: message.message_text,
          response_format: 'mp3'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        // Отслеживаем использование ElevenLabs для сообщений персонажа
        if (message.sender === 'character' && user) {
          elevenlabsService.trackUsage(user.id, message.session_id, message.message_text.length);
        }
        // Небольшая пауза между сообщениями
        setTimeout(() => {
          if (isPlaying) {
            playMessageSequentially(messageIndex + 1);
          }
        }, 1000); // Увеличена пауза до 1 секунды для лучшего восприятия
      };
      
      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        console.error('Audio playback error for message:', message.message_text);
        // Продолжаем со следующего сообщения
        setTimeout(() => {
          if (isPlaying) {
            playMessageSequentially(messageIndex + 1);
          }
        }, 500);
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error generating/playing audio for message:', error);
      // Продолжаем со следующего сообщения
      setTimeout(() => {
        if (isPlaying) {
          playMessageSequentially(messageIndex + 1);
        }
      }, 500);
    }
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    setCurrentMessageIndex(-1);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  const restartPlayback = () => {
    stopPlayback();
    setTimeout(() => {
      playFullConversation();
    }, 100);
  };

  const getSpeakerInfo = (message: ConversationMessage) => {
    return message.sender === 'user' ? {
      name: 'Вы',
      emoji: '👤',
      voice: 'alloy'
    } : {
      name: character.name,
      emoji: character.avatar,
      voice: 'nova'
    };
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Volume2 className="w-5 h-5" />
            <span>Полное аудио разговора</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Character Info */}
          <div className="text-center">
            <div className="text-4xl mb-2">{character.avatar}</div>
            <h3 className="font-medium">{character.name}</h3>
            <p className="text-sm text-gray-600">
              {sortedMessages.length} сообщений для воспроизведения
            </p>
          </div>

          {/* Progress */}
          {isPlaying && currentMessageIndex >= 0 && (
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="text-sm text-gray-600 mb-1">
                Сообщение {currentMessageIndex + 1} из {sortedMessages.length}
              </div>
              <div className="text-xs text-gray-500 mb-1">
                {getSpeakerInfo(sortedMessages[currentMessageIndex]).name}: 
                "{sortedMessages[currentMessageIndex]?.message_text?.substring(0, 40)}..."
              </div>
              <div className="text-xs text-blue-600">
                Голос: {getSpeakerInfo(sortedMessages[currentMessageIndex]).voice}
              </div>
            </div>
          )}

          {/* Info about voices */}
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-sm text-blue-800 font-medium mb-1">Голоса:</div>
            <div className="text-xs text-blue-600 space-y-1">
              <div>👤 Ваши сообщения: голос "alloy"</div>
              <div>{character.avatar} {character.name}: голос "nova"</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-3">
            {!isPlaying ? (
              <Button
                onClick={playFullConversation}
                disabled={isLoading || sortedMessages.length === 0}
                className="bg-gradient-to-r from-plady-pink to-plady-purple"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                Воспроизвести весь разговор
              </Button>
            ) : (
              <>
                <Button onClick={stopPlayback} variant="destructive">
                  <Pause className="w-4 h-4 mr-2" />
                  Остановить
                </Button>
                <Button onClick={restartPlayback} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Сначала
                </Button>
              </>
            )}
          </div>

          {/* Close */}
          <Button onClick={onClose} variant="ghost" className="w-full">
            Закрыть
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
