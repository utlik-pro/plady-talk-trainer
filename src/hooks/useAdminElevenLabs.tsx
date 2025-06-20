
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { adminElevenLabsService } from '@/services/adminElevenLabsService';
import { ElevenLabsUsage } from '@/types/admin';

export const useAdminElevenLabs = () => {
  const [elevenLabsUsage, setElevenLabsUsage] = useState<ElevenLabsUsage[]>([]);

  const fetchElevenLabsUsage = async () => {
    try {
      const usageData = await adminElevenLabsService.fetchElevenLabsUsage();
      setElevenLabsUsage(usageData);
    } catch (error) {
      console.error('Error in fetchElevenLabsUsage:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить данные ElevenLabs",
        variant: "destructive"
      });
    }
  };

  return {
    elevenLabsUsage,
    fetchElevenLabsUsage
  };
};
