import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useTrainingStats } from '@/hooks/useTrainingStats';
import { ArrowLeft, TrendingUp, Clock, BookOpen, Ear, Lightbulb } from 'lucide-react';
interface RecommendationsScreenProps {
  onBack: () => void;
}
export const RecommendationsScreen = ({
  onBack
}: RecommendationsScreenProps) => {
  const {
    user
  } = useAuth();
  const {
    stats,
    loading
  } = useTrainingStats();
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

  // Вычисляем средний балл из данных
  const averageScore = stats.totalSessions > 0 ? stats.totalSessions * 7.5 / stats.totalSessions : 0; // Примерный расчет

  const improvement = stats.totalSessions > 1 ? (stats.totalSessions - 1) * 0.3 : 0; // Примерное улучшение

  return <div className="min-h-screen bg-gradient-to-br from-plady-light to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-plady-pink to-plady-purple p-6 text-white bg-slate-950">
        
        <div className="text-center mt-4">
          <Lightbulb className="w-12 h-12 mb-2 mx-auto" />
          <h1 className="text-2xl font-bold">Рекомендации</h1>
          <p className="text-sm opacity-90">Персональные советы для улучшения навыков общения</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 bg-slate-950">
        {/* Overall Progress */}
        <div className="p-4 bg-gradient-card border border-border/50 hover:border-primary/50 transition-all duration-200 rounded-2xl my-[18px]">
          <h2 className="text-lg font-semibold mb-4">Общий прогресс</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-plady-purple mb-1">
                {loading ? '...' : averageScore.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Средний балл</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-plady-pink mb-1">
                +{loading ? '...' : improvement.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Улучшение</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {loading ? '...' : stats.totalSessions}
              </div>
              <div className="text-sm text-gray-600">Сессий</div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="p-4 bg-gradient-card border border-border/50 hover:border-primary/50 transition-all duration-200 rounded-2xl">
          <h2 className="text-lg font-semibold mb-4">Достижения</h2>
          <div className="space-y-3">
            <div className={`flex items-center space-x-3 p-3 rounded-lg border ${stats.totalSessions >= 1 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-50'}`}>
              <div className="text-2xl">🎯</div>
              <div className="flex-1">
                <div className="font-medium">Первые шаги</div>
                <div className="text-sm text-gray-600">Завершите первую тренировку</div>
                <div className="text-xs text-gray-500 mt-1">
                  Прогресс: {Math.min(stats.totalSessions, 1)}/1
                </div>
              </div>
              {stats.totalSessions >= 1 && <div className="text-green-500 text-xl">✓</div>}
            </div>
            
            <div className={`flex items-center space-x-3 p-3 rounded-lg border ${stats.totalSessions >= 5 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-50'}`}>
              <div className="text-2xl">💪</div>
              <div className="flex-1">
                <div className="font-medium">Постоянство</div>
                <div className="text-sm text-gray-600">Завершите 5 тренировок</div>
                <div className="text-xs text-gray-500 mt-1">
                  Прогресс: {Math.min(stats.totalSessions, 5)}/5
                </div>
              </div>
              {stats.totalSessions >= 5 && <div className="text-green-500 text-xl">✓</div>}
            </div>
            
            <div className={`flex items-center space-x-3 p-3 rounded-lg border ${stats.totalSessions >= 10 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-50'}`}>
              <div className="text-2xl">🏆</div>
              <div className="flex-1">
                <div className="font-medium">Мастер общения</div>
                <div className="text-sm text-gray-600">Завершите 10 тренировок</div>
                <div className="text-xs text-gray-500 mt-1">
                  Прогресс: {Math.min(stats.totalSessions, 10)}/10
                </div>
              </div>
              {stats.totalSessions >= 10 && <div className="text-green-500 text-xl">✓</div>}
            </div>

            <div className={`flex items-center space-x-3 p-3 rounded-lg border ${stats.totalMinutes >= 60 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-50'}`}>
              <div className="text-2xl">⏰</div>
              <div className="flex-1">
                <div className="font-medium">Марафонец</div>
                <div className="text-sm text-gray-600">Проведите 60 минут в тренировках</div>
                <div className="text-xs text-gray-500 mt-1">
                  Прогресс: {Math.min(stats.totalMinutes, 60)}/60 минут
                </div>
              </div>
              {stats.totalMinutes >= 60 && <div className="text-green-500 text-xl">✓</div>}
            </div>

            <div className={`flex items-center space-x-3 p-3 rounded-lg border ${stats.totalMessages >= 50 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-50'}`}>
              <div className="text-2xl">💬</div>
              <div className="flex-1">
                <div className="font-medium">Болтун</div>
                <div className="text-sm text-gray-600">Отправьте 50 сообщений</div>
                <div className="text-xs text-gray-500 mt-1">
                  Прогресс: {Math.min(stats.totalMessages, 50)}/50 сообщений
                </div>
              </div>
              {stats.totalMessages >= 50 && <div className="text-green-500 text-xl">✓</div>}
            </div>
          </div>
        </div>

        {/* Recommendations List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Персональные рекомендации</h2>
          
          {loading ? <div className="text-center py-12">
              <div className="text-gray-500">Загрузка рекомендаций...</div>
            </div> : stats.overallRecommendations.length === 0 ? <div className="text-center py-12">
              <Lightbulb className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Рекомендации пока недоступны
              </h3>
              <p className="text-gray-500">
                Проведите несколько тренировок, чтобы получить персональные советы
              </p>
            </div> : <div className="space-y-3">
              {stats.overallRecommendations.map((rec, index) => <div key={index} className="p-4 bg-gradient-card border border-border/50 hover:border-primary/50 transition-all duration-200 rounded-2xl">
                  <div className="flex items-start space-x-4">
                    <div className="text-plady-purple">💡</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800">Рекомендация {index + 1}</h3>
                        <span className="px-3 py-1 rounded-full text-xs font-medium border bg-blue-100 text-blue-800 border-blue-200">
                          Рекомендовано
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{rec}</p>
                    </div>
                  </div>
                </div>)}
            </div>}

          {/* Areas for improvement */}
          {!loading && stats.areasToImprove.length > 0 && <div className="space-y-3 mt-6">
              <h2 className="text-lg font-semibold">Области для улучшения</h2>
              {stats.areasToImprove.map((area, index) => <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="text-orange-500">🎯</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800">Область улучшения {index + 1}</h3>
                        <span className="px-3 py-1 rounded-full text-xs font-medium border bg-orange-100 text-orange-800 border-orange-200">
                          Требует внимания
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{area}</p>
                    </div>
                  </div>
                </div>)}
            </div>}
        </div>

        {/* Tips Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-plady-purple" />
            Общие советы
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
            {!loading && stats.totalSessions > 0 && <div className="flex items-center space-x-3 pt-2 border-t border-gray-100">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm text-gray-600">
                  Рекомендуем провести еще {Math.max(0, 10 - stats.totalSessions)} тренировок для достижения лучших результатов
                </p>
              </div>}
          </div>
        </div>
      </div>
    </div>;
};