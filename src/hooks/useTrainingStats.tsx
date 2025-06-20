
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface TrainingStats {
  totalMinutes: number;
  totalSessions: number;
  totalMessages: number;
  averageSessionDuration: number;
  overallRecommendations: string[];
  areasToImprove: string[];
}

export const useTrainingStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<TrainingStats>({
    totalMinutes: 0,
    totalSessions: 0,
    totalMessages: 0,
    averageSessionDuration: 0,
    overallRecommendations: [],
    areasToImprove: []
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Получаем все сессии пользователя
      const { data: sessions, error: sessionsError } = await supabase
        .from('conversation_sessions')
        .select('*')
        .eq('user_id', user.id);

      if (sessionsError) {
        console.error('Error fetching sessions:', sessionsError);
        return;
      }

      // Получаем все анализы для этих сессий
      const sessionIds = sessions?.map(s => s.id) || [];
      const { data: analyses, error: analysesError } = await supabase
        .from('conversation_analysis')
        .select('*')
        .in('session_id', sessionIds);

      if (analysesError) {
        console.error('Error fetching analyses:', analysesError);
      }

      // Подсчитываем статистику
      const totalSeconds = sessions?.reduce((sum, session) => sum + (session.duration_seconds || 0), 0) || 0;
      const totalMessages = sessions?.reduce((sum, session) => sum + (session.total_messages || 0), 0) || 0;
      const totalSessions = sessions?.length || 0;

      // Собираем все рекомендации и области улучшения
      const allRecommendations: string[] = [];
      const allAreasToImprove: string[] = [];
      
      analyses?.forEach(analysis => {
        if (analysis.recommendations) {
          allRecommendations.push(...analysis.recommendations);
        }
        if (analysis.areas_for_improvement) {
          allAreasToImprove.push(...analysis.areas_for_improvement);
        }
      });

      // Убираем дубликаты и берем топ рекомендации
      const uniqueRecommendations = [...new Set(allRecommendations)].slice(0, 5);
      const uniqueAreasToImprove = [...new Set(allAreasToImprove)].slice(0, 5);

      setStats({
        totalMinutes: Math.round(totalSeconds / 60),
        totalSessions,
        totalMessages,
        averageSessionDuration: totalSessions > 0 ? Math.round(totalSeconds / totalSessions / 60) : 0,
        overallRecommendations: uniqueRecommendations,
        areasToImprove: uniqueAreasToImprove
      });
    } catch (error) {
      console.error('Error in fetchStats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  return { stats, loading, refreshStats: fetchStats };
};
