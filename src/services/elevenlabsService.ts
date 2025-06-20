
import { supabase } from '@/integrations/supabase/client';

export const elevenlabsService = {
  async trackUsage(userId: string, sessionId: string, charactersCount: number) {
    // Примерная стоимость ElevenLabs: $0.00011 за символ
    const costPerCharacter = 0.00011;
    const cost = charactersCount * costPerCharacter;

    try {
      const { error } = await supabase
        .from('elevenlabs_usage')
        .insert({
          user_id: userId,
          session_id: sessionId,
          characters_count: charactersCount,
          cost: cost
        });

      if (error) {
        console.error('Error tracking ElevenLabs usage:', error);
        return;
      }

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
  }
};
