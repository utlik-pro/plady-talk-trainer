
import { supabase } from '@/integrations/supabase/client';
import { ElevenLabsUsage } from '@/types/admin';

export const adminElevenLabsService = {
  async fetchElevenLabsUsage(): Promise<ElevenLabsUsage[]> {
    console.log('Fetching ElevenLabs usage...');
    
    const { data, error } = await supabase
      .from('elevenlabs_usage')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching ElevenLabs usage:', error);
      throw error;
    }

    console.log('ElevenLabs usage data:', data);
    return data || [];
  }
};
