
import { useState, useCallback } from 'react';

interface VoiceChatConfig {
  apiKey: string;
  voiceId?: string;
  model?: string;
}

export const useVoiceChat = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [isConfigured, setIsConfigured] = useState(false);

  const configure = useCallback((config: VoiceChatConfig) => {
    setApiKey(config.apiKey);
    setIsConfigured(!!config.apiKey);
  }, []);

  const speak = useCallback(async (text: string) => {
    if (!apiKey) {
      console.error('ElevenLabs API key not configured');
      return;
    }

    setIsSpeaking(true);
    
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/9BWtsMINqrJLrRacOk9x', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error generating speech:', error);
      setIsSpeaking(false);
    }
  }, [apiKey]);

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsListening(true);
      
      // Здесь можно добавить logic для распознавания речи
      // Для MVP используем простую заглушку
      setTimeout(() => {
        setIsListening(false);
        stream.getTracks().forEach(track => track.stop());
      }, 3000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  return {
    isListening,
    isSpeaking,
    isConfigured,
    configure,
    speak,
    startListening,
    stopListening
  };
};
