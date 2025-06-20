
import { useState, useCallback } from 'react';
import { useConversation } from '@11labs/react';

interface VoiceChatConfig {
  apiKey: string;
  agentId?: string;
}

export const useVoiceChat = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isConfigured, setIsConfigured] = useState(false);
  
  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs conversation');
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs conversation');
    },
    onMessage: (message) => {
      console.log('Received message:', message);
    },
    onError: (error) => {
      console.error('Conversation error:', error);
    }
  });

  const configure = useCallback((config: VoiceChatConfig) => {
    setApiKey(config.apiKey);
    setIsConfigured(!!config.apiKey);
  }, []);

  const startListening = useCallback(async () => {
    if (!apiKey) {
      console.error('ElevenLabs API key not configured');
      return;
    }

    try {
      // Request microphone access first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Generate signed URL for the agent
      const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=agent_01jy3m8mhpe3092q9cmsvzcwe8`,
        {
          method: 'GET',
          headers: {
            'xi-api-key': apiKey
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get signed URL');
      }

      const { signed_url } = await response.json();
      
      // Start the conversation with the correct parameter name
      await conversation.startSession({
        signedUrl: signed_url
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  }, [apiKey, conversation]);

  const stopListening = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error('Error ending conversation:', error);
    }
  }, [conversation]);

  const speak = useCallback(async (text: string) => {
    // This method is no longer needed as the conversation handles TTS automatically
    console.log('Text would be spoken:', text);
  }, []);

  return {
    isListening: conversation.status === 'connected',
    isSpeaking: conversation.isSpeaking,
    isConfigured,
    configure,
    speak,
    startListening,
    stopListening
  };
};
