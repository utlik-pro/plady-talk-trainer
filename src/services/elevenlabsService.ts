
import { supabase } from '@/integrations/supabase/client';

export const elevenlabsService = {
  async trackUsage(userId: string, sessionId: string, charactersCount: number, conversationId?: string) {
    // Примерная стоимость ElevenLabs: $0.00011 за символ
    const costPerCharacter = 0.00011;
    const cost = charactersCount * costPerCharacter;

    try {
      console.log('Tracking ElevenLabs usage:', { userId, sessionId, charactersCount, cost, conversationId });
      
      const { error } = await supabase
        .from('elevenlabs_usage')
        .insert({
          user_id: userId,
          session_id: sessionId,
          conversation_id: conversationId || null,
          characters_count: charactersCount,
          cost: cost
        });

      if (error) {
        console.error('Error tracking ElevenLabs usage:', error);
        return;
      }

      console.log('ElevenLabs usage tracked successfully');

      // Обновляем общие расходы пользователя
      const { data: profile } = await supabase
        .from('profiles')
        .select('total_spent, elevenlabs_usage_count')
        .eq('id', userId)
        .single();

      if (profile) {
        await supabase
          .from('profiles')
          .update({
            total_spent: (profile.total_spent || 0) + cost,
            elevenlabs_usage_count: (profile.elevenlabs_usage_count || 0) + 1
          })
          .eq('id', userId);
        
        console.log('User profile updated with new spending:', {
          previousSpent: profile.total_spent,
          newSpent: (profile.total_spent || 0) + cost,
          previousUsageCount: profile.elevenlabs_usage_count,
          newUsageCount: (profile.elevenlabs_usage_count || 0) + 1
        });
      }
    } catch (error) {
      console.error('Error in trackUsage:', error);
    }
  },

  async getUserTotalSpent(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('elevenlabs_usage')
        .select('cost')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user spending:', error);
        return 0;
      }

      return data?.reduce((total, usage) => total + (usage.cost || 0), 0) || 0;
    } catch (error) {
      console.error('Error in getUserTotalSpent:', error);
      return 0;
    }
  },

  // Функция для получения метаданных от ElevenLabs после разговора
  async getConversationMetadata(conversationId: string, apiKey: string) {
    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/${conversationId}`,
        {
          method: 'GET',
          headers: {
            'xi-api-key': apiKey
          }
        }
      );

      if (!response.ok) {
        console.error('Failed to get conversation metadata:', response.status);
        return null;
      }

      const metadata = await response.json();
      console.log('ElevenLabs conversation metadata:', metadata);
      
      return {
        duration: metadata.duration_seconds || 0,
        cost: metadata.cost_breakdown?.total_cost || 0,
        charactersCount: metadata.cost_breakdown?.character_count || 0
      };
    } catch (error) {
      console.error('Error getting conversation metadata:', error);
      return null;
    }
  }
};
