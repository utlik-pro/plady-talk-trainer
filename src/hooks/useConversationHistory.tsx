
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { conversationService } from '@/services/conversationService';
import type { ConversationSession, Character, ConversationAnalysis } from '@/types/conversation';

export const useConversationHistory = () => {
  const { user, profile } = useAuth();
  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSessions = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const sessionsData = await conversationService.fetchSessions(user.id);
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error in fetchSessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const canCreateNewSession = () => {
    if (profile?.role === 'premium') return true;
    return sessions.length < 3; // Ограничение для бесплатного тарифа
  };

  const createSession = async (character: Character) => {
    if (!user) return null;

    // Проверяем лимит для бесплатного тарифа
    if (!canCreateNewSession()) {
      throw new Error('SESSION_LIMIT_REACHED');
    }

    try {
      const sessionId = await conversationService.createSession(user.id, character);
      if (sessionId) {
        // Обновляем список сессий после создания новой
        await fetchSessions();
      }
      return sessionId;
    } catch (error) {
      console.error('Error in createSession:', error);
      return null;
    }
  };

  const endSession = async (sessionId: string, durationSeconds: number) => {
    try {
      await conversationService.endSession(sessionId, durationSeconds);
    } catch (error) {
      console.error('Error in endSession:', error);
    }
  };

  const addMessage = async (sessionId: string, sender: 'user' | 'character', messageText: string) => {
    try {
      await conversationService.addMessage(sessionId, sender, messageText);
    } catch (error) {
      console.error('Error in addMessage:', error);
    }
  };

  const saveAnalysis = async (sessionId: string, analysis: ConversationAnalysis) => {
    try {
      await conversationService.saveAnalysis(sessionId, analysis);
    } catch (error) {
      console.error('Error in saveAnalysis:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  return {
    sessions,
    loading,
    canCreateNewSession,
    createSession,
    endSession,
    addMessage,
    saveAnalysis,
    refreshSessions: fetchSessions
  };
};
