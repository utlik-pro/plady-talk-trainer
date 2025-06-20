
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, BarChart3, Clock, MessageSquare, Target, FileText } from 'lucide-react';

interface HistoryScreenProps {
  onBack: () => void;
}

interface ConversationRecord {
  id: string;
  date: Date;
  duration: number;
  character: string;
  score: number;
  messagesCount: number;
  analysis: string;
  recommendations: string[];
}

export const HistoryScreen = ({ onBack }: HistoryScreenProps) => {
  const { user } = useAuth();

  // Mock data - в реальном приложении это будет из базы данных
  const conversationHistory: ConversationRecord[] = [
    {
      id: '1',
      date: new Date('2024-12-19'),
      duration: 180,
      character: 'Анна',
      score: 8.2,
      messagesCount: 12,
      analysis: 'Хорошая беседа с активным участием. Речь была четкой и понятной.',
      recommendations: ['Работать над интонацией', 'Добавить больше эмоций']
    },
    {
      id: '2',
      date: new Date('2024-12-18'),
      duration: 150,
      character: 'Анна',
      score: 7.8,
      messagesCount: 8,
      analysis: 'Разговор протекал естественно, но были длинные паузы.',
      recommendations: ['Улучшить темп речи', 'Больше задавать вопросов']
    },
    {
      id: '3',
      date: new Date('2024-12-17'),
      duration: 120,
      character: 'Анна',
      score: 7.5,
      messagesCount: 6,
      analysis: 'Первая тренировка прошла неплохо для начинающего.',
      recommendations: ['Больше практики', 'Работать над уверенностью']
    }
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 7) return 'text-yellow-600';
    return 'text-red-600';
  };

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
          <BarChart3 className="w-12 h-12 mb-2 mx-auto" />
          <h1 className="text-2xl font-bold">История тренировок</h1>
          <p className="text-sm opacity-90">Все ваши разговоры и их анализ</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-plady-purple mb-1">
                {conversationHistory.length}
              </div>
              <div className="text-sm text-gray-600">Всего сессий</div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-plady-pink mb-1">
                {formatDuration(conversationHistory.reduce((acc, conv) => acc + conv.duration, 0))}
              </div>
              <div className="text-sm text-gray-600">Общее время</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {(conversationHistory.reduce((acc, conv) => acc + conv.score, 0) / conversationHistory.length).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Средний балл</div>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Последние тренировки</h2>
          {conversationHistory.map((conversation) => (
            <div key={conversation.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Разговор с {conversation.character}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(conversation.date)}
                  </p>
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(conversation.score)}`}>
                  {conversation.score}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <Clock className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                  <div className="text-lg font-semibold text-gray-700">
                    {formatDuration(conversation.duration)}
                  </div>
                  <div className="text-xs text-gray-500">Длительность</div>
                </div>
                <div className="text-center">
                  <MessageSquare className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                  <div className="text-lg font-semibold text-gray-700">
                    {conversation.messagesCount}
                  </div>
                  <div className="text-xs text-gray-500">Сообщений</div>
                </div>
                <div className="text-center">
                  <Target className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                  <div className="text-lg font-semibold text-gray-700">
                    {conversation.recommendations.length}
                  </div>
                  <div className="text-xs text-gray-500">Рекомендаций</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Анализ
                </h4>
                <p className="text-sm text-gray-600 mb-3">{conversation.analysis}</p>
                
                <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Рекомендации
                </h4>
                <div className="space-y-1">
                  {conversation.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-plady-purple rounded-full"></div>
                      <span className="text-sm text-gray-600">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {conversationHistory.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              История пуста
            </h3>
            <p className="text-gray-500">
              Проведите первую тренировку, чтобы увидеть здесь результаты
            </p>
          </div>
        )}
      </div>
    </div>
  );

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  function formatDuration(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function getScoreColor(score: number) {
    if (score >= 8) return 'text-green-600';
    if (score >= 7) return 'text-yellow-600';
    return 'text-red-600';
  }
};
