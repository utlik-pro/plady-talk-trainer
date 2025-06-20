import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, Pause, Loader2, MessageSquare, Volume2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { conversationService } from '@/services/conversationService';
import { ConversationAnalysis } from './ConversationAnalysis';
import { FullAudioPlayer } from './FullAudioPlayer';
import type { ConversationSession, ConversationMessage, Character } from '@/types/conversation';

interface ConversationDetailScreenProps {
  session: ConversationSession;
  onBack: () => void;
}

export const ConversationDetailScreen = ({ session, onBack }: ConversationDetailScreenProps) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showFullAudioPlayer, setShowFullAudioPlayer] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [session.id]);

  const fetchMessages = async () => {
    try {
      const messagesData = await conversationService.fetchMessages(session.id);
      // Приводим типы к нужному формату
      const formattedMessages: ConversationMessage[] = messagesData.map(msg => ({
        ...msg,
        sender: msg.sender as 'user' | 'character'
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить сообщения",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const playAudio = async (text: string, messageId: string) => {
    if (playingMessageId === messageId) {
      setPlayingMessageId(null);
      return;
    }

    setPlayingMessageId(messageId);

    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          voice: 'nova',
          input: text,
          response_format: 'mp3'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setPlayingMessageId(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось воспроизвести аудио",
        variant: "destructive"
      });
      setPlayingMessageId(null);
    }
  };

  const handleAnalyze = () => {
    setShowAnalysis(true);
  };

  const character: Character = {
    name: session.character_name,
    avatar: session.character_avatar || "👩‍🦰",
    personality: session.character_personality || "Дружелюбная и общительная"
  };

  if (showAnalysis) {
    return (
      <ConversationAnalysis
        messages={messages}
        character={character}
        sessionId={session.id}
        onStartNew={() => setShowAnalysis(false)}
      />
    );
  }

  if (showFullAudioPlayer) {
    return (
      <FullAudioPlayer
        messages={messages}
        character={character}
        onClose={() => setShowFullAudioPlayer(false)}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-plady-light to-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-plady-purple" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-plady-light to-white">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Назад к истории</span>
          </Button>
          <div className="flex space-x-2">
            <Button 
              onClick={() => setShowFullAudioPlayer(true)} 
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Volume2 className="w-4 h-4" />
              <span>Слушать всё</span>
            </Button>
            <Button onClick={handleAnalyze} className="bg-gradient-to-r from-plady-pink to-plady-purple">
              <MessageSquare className="w-4 h-4 mr-2" />
              Анализ разговора
            </Button>
          </div>
        </div>

        {/* Session Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>{character.avatar}</span>
              <span>Разговор с {character.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Дата:</span>
                <br />
                <span className="font-medium">
                  {new Date(session.created_at).toLocaleDateString('ru-RU')}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Длительность:</span>
                <br />
                <span className="font-medium">
                  {Math.floor((session.duration_seconds || 0) / 60)}:{String((session.duration_seconds || 0) % 60).padStart(2, '0')}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Сообщений:</span>
                <br />
                <span className="font-medium">{messages.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id} className={`${message.sender === 'user' ? 'ml-12' : 'mr-12'}`}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">
                    {message.sender === 'user' ? '👤' : character.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">
                        {message.sender === 'user' ? 'Вы' : character.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleTimeString('ru-RU')}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{message.message_text}</p>
                    
                    {message.sender === 'character' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => playAudio(message.message_text, message.id)}
                        className="h-8 px-2"
                      >
                        {playingMessageId === message.id ? (
                          <Pause className="w-3 h-3" />
                        ) : (
                          <Play className="w-3 h-3" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
