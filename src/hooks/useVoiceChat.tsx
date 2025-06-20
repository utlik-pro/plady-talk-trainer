
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
    console.log('Voice chat configured with API key');
  }, []);

  const startListening = useCallback(async () => {
    if (!apiKey) {
      console.error('ElevenLabs API key not configured');
      return;
    }

    try {
      console.log('Requesting microphone access...');
      // Request microphone access first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted');
      
      console.log('Getting signed URL from ElevenLabs...');
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
        const errorText = await response.text();
        console.error('Failed to get signed URL:', response.status, errorText);
        throw new Error(`Failed to get signed URL: ${response.status}`);
      }

      const { signed_url } = await response.json();
      console.log('Got signed URL, starting session...');
      
      // Start the conversation with the correct parameter name
      await conversation.startSession({
        signedUrl: signed_url
      });
      
      console.log('Voice conversation started successfully');
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  }, [apiKey, conversation]);

  const stopListening = useCallback(async () => {
    try {
      console.log('Ending voice conversation...');
      await conversation.endSession();
      console.log('Voice conversation ended');
    } catch (error) {
      console.error('Error ending conversation:', error);
    }
  }, [conversation]);

  return {
    isListening: conversation.status === 'connected',
    isSpeaking: conversation.isSpeaking,
    isConfigured,
    configure,
    startListening,
    stopListening
  };
};
