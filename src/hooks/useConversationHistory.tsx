
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface ConversationSession {
  id: string;
  character_name: string;
  character_avatar: string;
  character_personality: string;
  start_time: string;
  end_time: string | null;
  duration_seconds: number;
  total_messages: number;
  analysis?: {
    overall_score: number;
    strengths: string[];
    areas_for_improvement: string[];
    recommendations: string[];
    detailed_feedback: string;
  };
}

interface ConversationMessage {
  id: string;
  session_id: string;
  sender: 'user' | 'character';
  message_text: string;
  timestamp: string;
}

export const useConversationHistory = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSessions = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data: sessionsData, error } = await supabase
        .from('conversation_sessions')
        .select(`
          *,
          conversation_analysis (
            overall_score,
            strengths,
            areas_for_improvement,
            recommendations,
            detailed_feedback
          )
        `)
        .eq('user_id', user.id)
        .order('start_time', { ascending: false });

      if (error) {
        console.error('Error fetching sessions:', error);
        return;
      }

      const formattedSessions = sessionsData?.map(session => ({
        id: session.id,
        character_name: session.character_name,
        character_avatar: session.character_avatar,
        character_personality: session.character_personality,
        start_time: session.start_time,
        end_time: session.end_time,
        duration_seconds: session.duration_seconds,
        total_messages: session.total_messages,
        analysis: session.conversation_analysis?.[0] || undefined
      })) || [];

      setSessions(formattedSessions);
    } catch (error) {
      console.error('Error in fetchSessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (character: {
    name: string;
    avatar: string;
    personality: string;
  }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('conversation_sessions')
        .insert({
          user_id: user.id,
          character_name: character.name,
          character_avatar: character.avatar,
          character_personality: character.personality
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating session:', error);
        return null;
      }

      return data?.id;
    } catch (error) {
      console.error('Error in createSession:', error);
      return null;
    }
  };

  const endSession = async (sessionId: string, durationSeconds: number) => {
    try {
      const { error } = await supabase
        .from('conversation_sessions')
        .update({
          end_time: new Date().toISOString(),
          duration_seconds: durationSeconds
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Error ending session:', error);
      }
    } catch (error) {
      console.error('Error in endSession:', error);
    }
  };

  const addMessage = async (sessionId: string, sender: 'user' | 'character', messageText: string) => {
    try {
      const { error } = await supabase
        .from('conversation_messages')
        .insert({
          session_id: sessionId,
          sender,
          message_text: messageText
        });

      if (error) {
        console.error('Error adding message:', error);
        return;
      }

      // Update message count
      const { error: updateError } = await supabase.rpc('increment_message_count', {
        session_id: sessionId
      });

      if (updateError) {
        console.error('Error updating message count:', updateError);
      }
    } catch (error) {
      console.error('Error in addMessage:', error);
    }
  };

  const saveAnalysis = async (sessionId: string, analysis: {
    overall_score: number;
    strengths: string[];
    areas_for_improvement: string[];
    recommendations: string[];
    detailed_feedback: string;
  }) => {
    try {
      const { error } = await supabase
        .from('conversation_analysis')
        .insert({
          session_id: sessionId,
          overall_score: analysis.overall_score,
          strengths: analysis.strengths,
          areas_for_improvement: analysis.areas_for_improvement,
          recommendations: analysis.recommendations,
          detailed_feedback: analysis.detailed_feedback
        });

      if (error) {
        console.error('Error saving analysis:', error);
      }
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
