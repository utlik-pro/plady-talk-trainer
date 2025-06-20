
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, TrendingUp, Clock, BookOpen, Ear, Lightbulb } from 'lucide-react';

interface RecommendationsScreenProps {
  onBack: () => void;
}

export const RecommendationsScreen = ({ onBack }: RecommendationsScreenProps) => {
  const { user } = useAuth();

  const recommendations = [
    {
      id: 1,
      title: "Улучшение интонации",
      description: "Работайте над выразительностью речи, добавляйте эмоциональные акценты",
      priority: "high",
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      id: 2,
      title: "Темп речи",
      description: "Старайтесь говорить медленнее, делайте паузы между предложениями",
      priority: "medium",
      icon: <Clock className="w-6 h-6" />
    },
    {
      id: 3,
      title: "Словарный запас",
      description: "Используйте более разнообразные слова и выражения",
      priority: "low",
      icon: <BookOpen className="w-6 h-6" />
    },
    {
      id: 4,
      title: "Активное слушание",
      description: "Больше задавайте уточняющих вопросов собеседнику",
      priority: "medium",
      icon: <Ear className="w-6 h-6" />
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Высокий приоритет';
      case 'medium':
        return 'Средний приоритет';
      case 'low':
        return 'Низкий приоритет';
      default:
        return 'Обычный';
    }
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
          <Lightbulb className="w-12 h-12 mb-2 mx-auto" />
          <h1 className="text-2xl font-bold">Рекомендации</h1>
          <p className="text-sm opacity-90">Персональные советы для улучшения навыков общения</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Overall Progress */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold mb-4">Общий прогресс</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-plady-purple mb-1">7.2</div>
              <div className="text-sm text-gray-600">Средний балл</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-plady-pink mb-1">+0.8</div>
              <div className="text-sm text-gray-600">Улучшение</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">12</div>
              <div className="text-sm text-gray-600">Сессий</div>
            </div>
          </div>
        </div>

        {/* Recommendations List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Персональные рекомендации</h2>
          {recommendations.map((rec) => (
            <div key={rec.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-start space-x-4">
                <div className="text-plady-purple">{rec.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{rec.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                      {getPriorityText(rec.priority)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{rec.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-plady-purple" />
            Советы дня
          </h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-plady-purple rounded-full"></div>
              <p className="text-sm text-gray-600">Практикуйтесь каждый день хотя бы 10 минут</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-plady-pink rounded-full"></div>
              <p className="text-sm text-gray-600">Записывайте себя на диктофон и анализируйте речь</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-gray-600">Читайте вслух художественную литературу</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
