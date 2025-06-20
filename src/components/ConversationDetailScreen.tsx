
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MessageSquare, Clock, Play, Pause, Loader2, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { ConversationSession, ConversationMessage } from '@/types/conversation';
import { toast } from '@/hooks/use-toast';

interface ConversationDetailScreenProps {
  session: ConversationSession;
  onBack: () => void;
  onAnalyze: (messages: ConversationMessage[], session: ConversationSession) => void;
}

export const ConversationDetailScreen = ({ session, onBack, onAnalyze }: ConversationDetailScreenProps) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [audioLoading, setAudioLoading] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('conversation_messages')
        .select('*')
        .eq('session_id', session.id)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
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

  const generateAudioForMessage = async (messageText: string, messageId: string) => {
    setAudioLoading(messageId);
    
    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer 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`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: messageText,
          voice: 'nova',
          response_format: 'mp3',
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка генерации аудио');
      }

      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(blob);
      
      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);
      setPlayingMessageId(messageId);
      
      audio.onended = () => {
        setPlayingMessageId(null);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error generating audio:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сгенерировать аудио",
        variant: "destructive"
      });
    } finally {
      setAudioLoading(null);
    }
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      setPlayingMessageId(null);
    }
  };

  const formatTime = (dateString: string) => {
    return new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    fetchMessages();
    
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }
    };
  }, [session.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-plady-light to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-plady-purple mb-4" />
          <p className="text-gray-600">Загрузка разговора...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-plady-light to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-plady-pink to-plady-purple p-6 text-white">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
        </div>
        <div className="text-center mt-4">
          <div className="text-4xl mb-2">{session.character_avatar}</div>
          <h1 className="text-2xl font-bold">Разговор с {session.character_name}</h1>
          <p className="text-sm opacity-90">
            {new Intl.DateTimeFormat('ru-RU', {
              day: 'numeric',
              month: 'long',
              hour: '2-digit',
              minute: '2-digit'
            }).format(new Date(session.start_time))}
          </p>
        </div>
      </div>

      {/* Session Info */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
            <Clock className="w-5 h-5 mx-auto text-gray-400 mb-2" />
            <div className="text-lg font-semibold text-gray-700">
              {formatDuration(session.duration_seconds)}
            </div>
            <div className="text-xs text-gray-500">Длительность</div>
          </div>
          
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
            <MessageSquare className="w-5 h-5 mx-auto text-gray-400 mb-2" />
            <div className="text-lg font-semibold text-gray-700">
              {session.total_messages}
            </div>
            <div className="text-xs text-gray-500">Сообщений</div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
            <BarChart3 className="w-5 h-5 mx-auto text-gray-400 mb-2" />
            <div className="text-lg font-semibold text-gray-700">
              {session.analysis?.overall_score || 'N/A'}
            </div>
            <div className="text-xs text-gray-500">Балл</div>
          </div>
        </div>

        {/* Analyze Button */}
        {!session.analysis && (
          <div className="mb-6">
            <Button
              onClick={() => onAnalyze(messages, session)}
              className="w-full bg-gradient-to-r from-plady-pink to-plady-purple"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Сделать анализ и получить рекомендации
            </Button>
          </div>
        )}

        {/* Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              История сообщений
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-plady-purple text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">
                        {message.sender === 'user' ? 'Вы' : session.character_name}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs opacity-70">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.sender === 'character' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => {
                              if (playingMessageId === message.id) {
                                stopAudio();
                              } else {
                                generateAudioForMessage(message.message_text, message.id);
                              }
                            }}
                            disabled={audioLoading === message.id}
                          >
                            {audioLoading === message.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : playingMessageId === message.id ? (
                              <Pause className="h-3 w-3" />
                            ) : (
                              <Play className="h-3 w-3" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm">{message.message_text}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
