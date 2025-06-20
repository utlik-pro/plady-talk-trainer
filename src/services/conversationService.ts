
import { supabase } from '@/integrations/supabase/client';
import type { ConversationSession, Character, ConversationAnalysis } from '@/types/conversation';

export const conversationService = {
  async fetchSessions(userId: string): Promise<ConversationSession[]> {
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
      .eq('user_id', userId)
      .order('start_time', { ascending: false });

    if (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }

    return sessionsData?.map(session => ({
      id: session.id,
      character_name: session.character_name,
      character_avatar: session.character_avatar,
      character_personality: session.character_personality,
      start_time: session.start_time,
      end_time: session.end_time,
      duration_seconds: session.duration_seconds,
      total_messages: session.total_messages,
      created_at: session.created_at,
      analysis: session.conversation_analysis?.[0] || undefined
    })) || [];
  },

  async fetchMessages(sessionId: string) {
    const { data, error } = await supabase
      .from('conversation_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }

    return data || [];
  },

  async createSession(userId: string, character: Character): Promise<string | null> {
    const { data, error } = await supabase
      .from('conversation_sessions')
      .insert({
        user_id: userId,
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

    return data?.id || null;
  },

  async endSession(sessionId: string, durationSeconds: number): Promise<void> {
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
  },

  async addMessage(sessionId: string, sender: 'user' | 'character', messageText: string): Promise<void> {
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

    // Update message count manually
    const { data: currentSession } = await supabase
      .from('conversation_sessions')
      .select('total_messages')
      .eq('id', sessionId)
      .single();

    if (currentSession) {
      const { error: updateError } = await supabase
        .from('conversation_sessions')
        .update({ total_messages: currentSession.total_messages + 1 })
        .eq('id', sessionId);

      if (updateError) {
        console.error('Error updating message count:', updateError);
      }
    }
  },

  async saveAnalysis(sessionId: string, analysis: ConversationAnalysis): Promise<void> {
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
  }
};
