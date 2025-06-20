
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { conversationService } from '@/services/conversationService';
import type { ConversationSession, Character, ConversationAnalysis } from '@/types/conversation';

export const useConversationHistory = () => {
  const { user } = useAuth();
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

  const createSession = async (character: Character) => {
    if (!user) return null;

    try {
      return await conversationService.createSession(user.id, character);
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
    createSession,
    endSession,
    addMessage,
    saveAnalysis,
    refreshSessions: fetchSessions
  };
};
